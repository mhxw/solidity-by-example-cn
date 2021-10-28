yarn build
cd build
git init
git add .
git commit -m "first commit"
git branch -M master
git remote add origin https://github.com/mhxw/solidity-by-example-cn.git
git push -u -f origin master
cd ../
rm -rf build