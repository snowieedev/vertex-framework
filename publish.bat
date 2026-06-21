call pnpm -r version patch
if %errorlevel% neq 0 exit /b %errorlevel%
call pnpm run build
if %errorlevel% neq 0 exit /b %errorlevel%
git commit -am "chore: release workspace update"
git push
call pnpm publish -r --access public --no-git-checks
