git add .
git commit -m "feat: Implement Composer architecture"
git push
pnpm -r version patch
git add .
git commit -m "chore: bump versions"
git push
pnpm publish -r --no-git-checks
