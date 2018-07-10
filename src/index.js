import initModel from './Model';
import update from './Update';
import view from './View';
import app from './App';
import axios from "axios/index";
import config from "../config.json";
const { apiKey } = "../.apiKey.json";
const { country, language, apiUrl, apiVersion, initialPageSize, pageSize } = config;
const api = apiUrl+'/'+apiVersion+'/';
const node = document.getElementById('app');

initializeModel(initModel);

function run(model) {
    app(model, update, view, node);
}

function getSourcesAndRun(model) {
    const request = `${api}sources?language=${language}&apiKey=${apiKey}`;
    axios(request)
        .then(function (response) {
            model = {...model, sources: response.data.sources};
            run(model);
        })
        .catch(error);
}

function initializeModel(model) {
    const request = `${api}top-headlines?country=${country}&apiKey=${apiKey}&pageSize=${initialPageSize}`;
    axios(request)
        .then(function (response) {
            model = {...model, articles: response.data.articles};
            getSourcesAndRun(model);
        })
        .catch(error);
}

function error(err) {
    console.log("error response " + err);
    console.log(JSON.stringify(err.response, null, 2));
}

export function getArticleUrl(category, source) {
    if (source !== undefined) {
        return `${api}top-headlines?apiKey=${apiKey}&sources=${source}&pageSize=${pageSize}`;
    }
    if (category === 'headlines') {
        return `${api}top-headlines?country=${country}&apiKey=${apiKey}&pageSize=${pageSize}`;
    }
    return `${api}top-headlines?country=us&apiKey=${apiKey}&category=${category}&pageSize=${pageSize}`;
}