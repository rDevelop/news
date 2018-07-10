import * as R from 'ramda';

const MSGS = {
    HTTP_ARTICLE_SUCCESS: 'HTTP_ARTICLE_SUCCESS',
    HTTP_ERROR: 'HTTP_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    GET_ARTICLES: 'GET_ARTICLES',
    HEADER_MSG: "HEADER_MSG",
};

export function getArticlesMsg(request, category) {
    return {
        type: MSGS.GET_ARTICLES,
        request: request,
        category: category,
    }
}

export function headerMsg(value) {
    return {
        type: MSGS.HEADER_MSG,
        value: value,
    };
}

const httpArticleSuccessMsg = R.curry((response) => ({
    type: MSGS.HTTP_ARTICLE_SUCCESS,
    response,
}));

function httpErrorMsg(error) {
    return {
        type: MSGS.HTTP_ERROR,
        error,
    };
}

function update(msg, model) {
    switch (msg.type) {
        case MSGS.HEADER_MSG: {
            if( msg.value === 'sources') {
                const flip = !model.showSources;
                return {...model, showSources: flip};
            }
            return model;
        }
        case MSGS.GET_ARTICLES: {
            const { request, category } = msg;
            return [{
                ...model, activeCategory: category
            },
                {
                    request: request,
                    successMsg: httpArticleSuccessMsg,
                    errorMsg: httpErrorMsg,
                }
            ];
        }
        case MSGS.HTTP_ARTICLE_SUCCESS: {
            const {articles} = msg.response.data;
            return {
                ...model,
                articles,
            };
        }
        case MSGS.HTTP_ERROR: {
            const {error} = msg;
            return {...model, error: error.message};
        }
        case MSGS.CLEAR_ERROR: {
            return {...model, error: null};
        }
    }
    return model;
}

export default update;
