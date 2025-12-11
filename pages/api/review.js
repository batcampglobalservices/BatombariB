const review = [
    {
        id: 0,
        clientName: 'Friday',
        clientLocation: 'Nigeria',
        clientSource: 'Algorithmic Explorers',
        clientReview: 'It is always nice to work with him. The work is finished quickly and he does more than is asked of him. It is also clear that he has a lot of knowledge of the work he does. I look forward to our next collaboration.'
    },
    {
        id: 2,
        clientName: 'Emmanuel Boniface',
        clientLocation: 'Nigeria',
        clientSource: 'Algorithmic Explorers',
        clientReview: 'He is very good with communication and experienced website developer, great experience to work with him. '
    },
]
export default function handler(req, res) {
    res.status(200).json(review)
}
