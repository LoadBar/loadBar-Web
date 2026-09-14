# Repository Language Analysis Plan

## Objective

For all repositories granted to LoadBar:

1. Retrieve each repository's file tree.
2. Count all files across all repositories.
3. Classify source files by language and combine each language's count.
4. Calculate:

```text
language percentage = (language file count / total file count) * 100
```

If there are 1,000 files across all repositories and 250 are Python files,
Python is 25%.

## Current LoadBar code

`lib/github/repositories.ts` currently calls:

```text
GET /user/installations/{installation_id}/repositories
```

That returns repository metadata only. LoadBar currently retains the id, name,
full name, description, URL, visibility, primary language, and update date. It
does not retrieve repository trees or files.

The existing primary `language` value cannot produce the requested counts.
GitHub's repository-languages endpoint is not suitable either because it returns
bytes per language, not numbers of files.

## Proposed files

Keep the GitHub code organized like this:

```text
lib/github/client.ts
lib/github/repositories.ts
lib/github/repository-analysis.ts       <- add this
app/api/github/repository-analysis/
  route.ts                              <- add this
```

Keep GitHub API calls server-side. Never send the GitHub token to a React
component or browser response.

## 1. Retain the default branch

The repository-list response includes `default_branch`, but the current mapper
discards it. In `lib/github/repositories.ts`:

- add `default_branch: string` to `GithubRepoResponse`;
- add `defaultBranch: string` to `GithubRepo`;
- map `default_branch` in `mapRepo()`.

The default branch is required to request the repository tree.

## 2. Add analysis types

In `lib/github/repository-analysis.ts`, define types like:

```ts
type GitTreeEntry = {
  path: string
  type: 'blob' | 'tree' | 'commit'
  size?: number
  sha: string
}

type GitTreeResponse = {
  tree: GitTreeEntry[]
  truncated: boolean
}

type RepositoryFileAnalysis = {
  repositoryId: number
  fullName: string
  totalFiles: number
  classifiedFiles: number
  unclassifiedFiles: number
  languageFileCounts: Record<string, number>
  treeTruncated: boolean
}

type CombinedRepositoryAnalysis = {
  repositoryCount: number
  successfulRepositories: number
  failedRepositories: number
  totalFiles: number
  classifiedFiles: number
  unclassifiedFiles: number
  languageFileCounts: Record<string, number>
  languagePercentages: Record<string, number>
  repositories: RepositoryFileAnalysis[]
}
```

Count only entries whose `type` is `blob`. A directory is `tree`, and a Git
submodule is normally `commit`; neither is a file for this calculation.

## 3. Fetch one repository tree

Add a server-only function:

```ts
fetchRepositoryTree(token, repository)
```

Call the existing `githubRequest()` helper with:

```text
GET /repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1
```

Split `repository.fullName` into owner/repo and URL-encode all path values. The
GitHub App's read-only Contents permission supports this endpoint.

Do not download every source file. A tree response provides the paths needed for
file counting without downloading file contents.

## 4. Classify each file path

Add one pure function:

```ts
detectLanguage(path: string): string | null
```

Use a single, explicit extension map, for example:

```ts
const languageByExtension: Record<string, string> = {
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript',
  '.py': 'Python',
  '.java': 'Java',
  '.go': 'Go',
  '.rs': 'Rust',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.cs': 'C#',
  '.cpp': 'C++',
  '.c': 'C',
  '.swift': 'Swift',
  '.kt': 'Kotlin'
}
```

Normalize extensions to lowercase. You can also have a small filename map for
extensionless files such as `Dockerfile` and `Makefile`. Decide once whether
those are language categories or unclassified files, and remain consistent.

Images, Markdown, JSON, lockfiles, and unknown extensions still contribute to
`totalFiles`, but they contribute to `unclassifiedFiles` rather than a
programming-language count.

Because the requested denominator is **all files**, programming-language
percentages may total less than 100%. The remainder is unclassified files. If
you later divide by `classifiedFiles`, the language chart will total 100%, but
that would be a different metric.

## 5. Analyse one repository

Add:

```ts
analyseRepositoryFiles(token, repository)
```

Its logic should be:

```text
tree = fetch recursive repository tree
files = entries where type is "blob"
totalFiles = files.length

for each file:
  language = detectLanguage(file.path)
  if language exists:
    languageFileCounts[language] += 1
  else:
    unclassifiedFiles += 1

classifiedFiles = totalFiles - unclassifiedFiles
```

Return the per-repository result and preserve the tree's `truncated` value.

## 6. Loop through and combine repositories

Add:

```ts
analyseAllRepositories(token, repositories)
```

Use a concurrency limit of roughly 3-5 repository requests instead of an
unlimited `Promise.all()`. This reduces secondary-rate-limit failures.

For every successful repository:

```text
combined.totalFiles += repository.totalFiles

for each (language, count) in repository.languageFileCounts:
  combined.languageFileCounts[language] += count
```

If one repository fails, record its error and continue. Do not discard all
successful results.

## 7. Calculate the final percentages

After combining all repositories:

```ts
const percentage =
  totalFiles === 0 ? 0 : (languageFileCount / totalFiles) * 100
```

Round only for display (for example, one decimal place). Keep unrounded values
internally.

Example:

```text
Total files:       1,000
Python:              250 -> 25.0%
TypeScript:          200 -> 20.0%
JavaScript:          100 -> 10.0%
Unclassified:        450 -> 45.0%
```

## 8. Add an authenticated API route

In `app/api/github/repository-analysis/route.ts`:

1. Call `getValidRequestSession()`.
2. Return 401 if there is no valid server session.
3. Call `fetchGrantedRepositories()` with the server-side token.
4. Call `analyseAllRepositories()` with the token and repositories.
5. Return only analysis results, never the token.
6. Return safe errors for GitHub 403/404/rate-limit responses.

Keep this separate from `/api/github/repositories`. The existing endpoint is the
working Fetch step; analysis is a slower, separate operation.

## 9. Handle GitHub edge cases

The recursive Git Trees response can set `truncated: true` for very large
repositories. Never present a truncated count as exact.

For a first version, mark that repository and the combined result incomplete. A
fully exact version must request non-recursive trees and walk each subtree until
all entries have been visited.

Also handle:

- empty repositories without a default-branch tree;
- inaccessible or deleted repositories;
- renamed default branches;
- rate and secondary-rate limits;
- repeated analysis requests without adding stored totals twice.

## 10. Tests to write first

Test the pure classification and aggregation logic without calling GitHub:

1. An empty repository list returns zero and does not divide by zero.
2. Python counts from two repositories are added together.
3. `.PY` and `.py` both map to Python.
4. Directories and submodules do not count as files.
5. Unknown extensions count as files but remain unclassified.
6. Percentages use the global file total, not each repository's total.
7. One failed repository does not erase successful results.
8. A truncated tree is clearly marked incomplete.

## Recommended implementation order

1. Add `defaultBranch` to repository metadata.
2. Create `repository-analysis.ts` and its types.
3. Write and test `detectLanguage()`.
4. Implement tree fetching for one small repository.
5. Implement per-repository counting.
6. Implement bounded-concurrency aggregation.
7. Calculate global percentages.
8. Add the authenticated API route.
9. Test one repository, then all granted repositories.
10. Only after real results work, connect this endpoint to onboarding Analyse.

Do not add fake timers or simulated progress.

## Definition of done

- File counts come from real GitHub tree responses.
- Language counts come from actual file paths, not the primary-language metadata.
- `totalFiles` is the sum of blob entries from successfully analysed repos.
- Each percentage equals `(language files / totalFiles) * 100`.
- Unknown files remain visible as unclassified.
- Truncated and failed repositories are reported, not hidden.
- GitHub credentials remain server-side.

## Official GitHub references

- Git Trees: https://docs.github.com/en/rest/git/trees
- Repository languages (byte counts):
  https://docs.github.com/en/rest/repos/repos#list-repository-languages
- GitHub App user access tokens:
  https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app
