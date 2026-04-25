

## TO CREATE YOUR VIRTUAL ENVIROMENT

### Create virtual environment
```bash
 python -m venv ocr-env
```
### Activate — Windows
```bash
ocr-env\Scripts\activate
```
### Activate — Mac/Linux
```bash
source ocr-env/bin/activate
```
### Install dependencies
```bash
pip install -r requirements.txt
```

## TO INITIALIZE YOUR REPO

### Create a folder on your system
### Open it in Vscode

### Initialize Git
```bash
 git init
```
### Link to the existing remote repository
```bash
git remote add origin https://github.com/tokky-1/DSA-GROUP-3.git
git remote -v
```
### Pull existing code from the repo
```bash
git pull origin main --allow-unrelated-histories
```
### Create your own branch
```bash
git checkout -b your-branch-name
```
### Push your branch to remote
```bash
git push -u origin your-branch-name
```