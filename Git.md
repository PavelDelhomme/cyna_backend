# Processus de récupération des pull request

`git checkout dev`
`git pull origin dev`

# Récupération des modification de dev sur dev-paul
`git checkout dev-paul`
`git merge dev`

# Si conflit
après résolution donc : 
`git add <fichuier_conflit>`
# Validation de la fusion
`git commit -m "fusion de dev dans dev-paul`

# Pousser les changement vers le dépôt
`git push origin dev-paul`

