const background = [
    {
        eduCards: [
            {
                id: 0,
                title: 'University of Nigeria Secondary School, Nsukka',
                degree: 'Junior Secondary School Education',
                detail: "Secondary School Education",
                year: '2018-2022'
            },
        ]
    },
    {
        expCards: [
            {
                id: 1,
                title: 'Algorithmic Explorers',
                role: 'Fullstack Engineer',
                url:'no website',
                desc: 'As a fullstack engineer, I use React, Next, Django Rest Framework, & JavaScript to build web applications.',
                year: '08/25 - Present',
                location: 'Nigeria'
            },
            {
                id: 2,
                title: 'HNG Internship ',
                role: 'Internee',
                url: 'no website',
                desc: 'As an Internee, I learned how to use React & JavaScript to build interactive websites.',
                year: '08/2025 - 12/25',
                location: 'Nigeria'
            },
            {
                id: 3,
                title: 'Ginakev Digital Academy',
                role: 'Backend Developer',
                url: 'https://www.gida.academy/',
                desc: "I work there as a Backend developer, there I learned how to do CRUD'S operations in Python, also I worked on Supabase",
                year: '08/2025 - Present',
                location: 'Nigeria'
            },

        ]
    }
]


export default function handler(req, res) {
    res.status(200).json(background)
}
