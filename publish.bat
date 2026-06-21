pnpm -r version patch
if %errorlevel% neq 0 exit /b %errorlevel%
pnpm run build
if %errorlevel% neq 0 exit /b %errorlevel%
git commit -am "chore: release 0.1.2"
git push
pnpm publish -r --access public --no-git-checks
