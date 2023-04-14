'use strict'
const natural = require('natural')
const pos = require('pos')

const tokenizer = new natural.WordTokenizer()
const stopWords = natural.stopwords
const tagger = new pos.Tagger()

exports.nounTokenizer = (inputString) => {
	const tokens = tokenizer.tokenize(inputString).filter((token) => {
		return !stopWords.includes(token)
	})
	const taggedTokens = tagger.tag(tokens)
	const keywords = []
	for (const [token, tag] of taggedTokens) {
		if (tag.startsWith('NN') /* || tag.startsWith('JJ') */) {
			// NN is the tag for a noun
			keywords.push(token)
		}
	}
	return keywords
}
