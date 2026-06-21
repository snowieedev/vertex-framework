pnpm -r version patch
git add .
git commit -m "chore: bump versions to 0.1.2"
git push
pnpm publish -r --access public --no-git-checks
