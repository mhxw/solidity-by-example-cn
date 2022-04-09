rm -rf .git
git init
git config user.name "MHXW"
git config user.email "32643286+mhxw@users.noreply.github.com"
git add .
git commit -m 'first commit'
git branch -M dev
git remote rm origin
git remote add origin https://github.com/mhxw/solidity-by-example-cn.git
git push -u -f dev