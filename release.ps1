pnpm -r version patch
pnpm run build
git add .
git commit -m "fix: add dev scripts and upgrade ESLint to v9"
git push
pnpm publish -r --access public --no-git-checks
