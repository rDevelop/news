const source = {
    id: '',
    name: '',
    description: '',
    url: '',
    category: '',
    language: '',
    country: ''
};

const article = {
    author: '',
    title: '',
    description: '',
    url: '',
    urlToImage: '',
    publishedAt: ''
};

const categories = ['headlines','business','technology','sports','entertainment','health','science'];

const initModel = {
    categories: categories,
    articles: [article],
    sources: [source],
    activeCategory: 'headlines',
    showSources: false,
    showCategories: false,
    error: null
};

export default initModel;
