## State

```
{
  // data
  cards: {
    cardId: {
      kanji: string
      hiragana: string
      meaning: string
      tags: [ string ]
      successes: {
        [type]: number
      }
    }
  },
  tags: [ string ]
  lastUpdated: number

  // UI state
  quizEnabled: boolean
  quizType: string
  filteredTags: [string]

  showModal: boolean
  modalCardId: string
}
```
