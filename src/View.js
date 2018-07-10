import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import {h} from 'virtual-dom';
import {
    getArticlesMsg,
    headerMsg,
} from "./Update";
import {getArticleUrl} from "./index";

const {div, label, header, button, ul, li, a, img} = hh(h);

function view(dispatch, model) {
    return div({className: 'shadow-2'}, [
        categoryHeader(dispatch, model),
        div({className: 'flex items-start mt5 bg-white'}, [
            div({className: 'w-30'},
                sideMenu(dispatch, model),
            ),
            div({className: 'w-65 h9'}, [
                mainBody(dispatch, model),
            ]),
            div({className: 'w-15 pa2 mr1 pt3'}, [
                columnHeader(dispatch, "News"),
            ]),
        ]),

    ]);
}

function categoryHeader(dispatch, model) {
    const {categories, activeCategory} = model;
    return header({
        className: 'shadow-3 bg-white pv1 pv1-3 bb fixed top-0 left-0 right-0 h-20',
        style: 'z-index:10;'
    }, [
        div({className: "w-95 flex justify-left items-center h3"}, [
            div({className: 'fixed top-10 left-1'},
                label({className: 'red b shadow-3 pa1 pl2 pr2 f4'}, activeCategory),
            ),
            div({className: 'mv0 ml5'},
                ul({className: 'list ml5'}, [
                    R.map(categoryHeaderButtons(dispatch), categories),
                ]),
            ),
        ]),

    ]);
}

function sideMenu(dispatch, model) {
    return div({className: ''}, [
        // Enables hidden categories
        //div({className: 'dn-l dib ml0 bg-white'}, [
        div({className: ''}, [
            // Enables label 
            // div({className: 'ml2 mt3'},
            //     columnHeader(dispatch, 'categories'),
            // ),
            ul({className: 'list pl2'}, [
                R.map(categoryMenuButtons(dispatch), model.categories),
            ]),
        ]),
        sideSourceMenu(dispatch, model),

    ]);
}

const categoryMenuButtons = R.curry((dispatch, category) => {
    const request = getArticleUrl(category);
    return li({className: 'grow mw2'}, [
        articleButton(dispatch, 'pointer shadow-3 grow dib f5 purple bg-white', request, category)
    ])
});

const categoryHeaderButtons = R.curry((dispatch, category) => {
    const request = getArticleUrl(category);
    return li({className: 'dn dib-l mr3 grow'}, [
        articleButton(dispatch, 'pointer shadow-3 grow f4-ns purple bg-white db pr2 pl2', request, category)
    ])
});

function mainBody(dispatch, model) {
    return div({className: 'mt3 bg-near-white'},
        articleBody(dispatch, model),
    );
}

function articleBody(dispatch, model) {
    const {articles} = model;
    return R.map(articleRows(dispatch), articles);
}

const articleRows = R.curry((dispatch, article) => {
    return articleRow(dispatch, article)
});

function articleRow(dispatch, article) {
    const {urlToImage} = article;
    const description = article.description ? article.description : article.title;
    if (article.urlToImage === null) {
        return div({className: 'shadow-3 dim flex items-start pt3 pb3 pl2'}, [
            articleLink(article, description),
        ]);
    }
    return div({className: 'flex f5 items-start shadow-3'}, [
        div({className: 'grow w-60 pa0'}, [
            articleLink(article, img({className: '', src: urlToImage, alt: description}))
        ]),
        div({className: 'w-40 pa0 ma3 dim'}, [
            articleLink(article, description),
        ]),
    ]);
}

function articleLink(article, value) {
    return a({className: 'link', href: article.url, target: 'article-view'}, value);
}

function articleButton(dispatch, className, request, value) {
    return button(
        {
            className: className,
            type: 'button',
            onclick: () => dispatch(getArticlesMsg(request, value)),
        },
        value
    );
}

const source = R.curry((dispatch, source) => {
    const {name, id, category,} = source;
    return li({className: 'f6 flex relative'}, [
        articleButton(dispatch, 'pointer shadow-3 grow dib f6 purple bg-white', getArticleUrl(category, id), name)
    ]);
});

function sources(dispatch, model) {
    const sources = R.map(source(dispatch), model.sources);
    return ul({className: 'list pl0 mw4'}, sources);
}

function sideSourceMenu(dispatch, model) {
    const sourceMenu = model.showSources ? sources(dispatch, model) : null;
    return div({className: 'db mt3 ml2 mr2 w4'}, [
        columnHeader(dispatch, 'sources'),
        sourceMenu,
    ]);
}

function columnHeader(dispatch, value) {
    return button({
        className: 'shadow-3 grow bg-purple f5 pa1 near-white b',
        type: 'button',
        onclick: () => dispatch(headerMsg(value)),
    }, value);
}

export default view;
