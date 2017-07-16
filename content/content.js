const content =
  {
    about: {
      title: 'About',
      content: require('./about.md')
    },
    careers: {
      title: 'Careers',
      content: require('./careers.md')
    },
    articles: {
      title: 'Articles',
      content: require('./articles.md')
    },
    home: {
      title: 'Home',
      sections: [
        require('./home/our-work.md'),
        require('./home/design-for-systems.md'),
        require('./home/our-approach.md'),
        require('./home/join-the-team.md')
      ]
    }
  }

export default content
