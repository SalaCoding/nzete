
use this in Bash to push the new numbers in database:
curl -X POST http://localhost:3001/singa/number/seed

or

curl -v -X POST http://localhost:3001/singa/number/seed


use this to push sambole into database
# Test get all Q&As
curl http://localhost:3001/singa/qa/qas

# Test get categories
curl http://localhost:3001/singa/qa/qa/categories

# Test get random Q&A
curl http://localhost:3001/singa/qa/qa/random

node seed/seedQA.js