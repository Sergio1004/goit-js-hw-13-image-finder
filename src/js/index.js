import '../sass/main.scss';
import './apiService';
import '@pnotify/core/dist/BrightTheme.css';
import "@pnotify/core/dist/PNotify.css";
import { error, notice } from "@pnotify/core";
import { refs } from './refs.js';
import * as basicLightbox from 'basiclightbox'
import 'basiclightbox/dist/basicLightbox.min.css';
import ImagesApiService from './apiService.js';
import imageCardTpl from '../templates/imageCardTpl.hbs';

const imagesApiService = new ImagesApiService()

refs.form.addEventListener('submit', onSearchImage)
refs.loadMoreBtn.addEventListener('click', onLoadMore)

async function onSearchImage(e) {
    e.preventDefault();

    try {
        imagesApiService.query = e.currentTarget.elements.query.value;

        if (imagesApiService.query === '') {
            return notice({
                text: "Enter something",
                delay: 2000,
            });
        };

        imagesApiService.resetPage();
        const images = await imagesApiService.fetchImages();
        
        reset()
        renderImages(images)
    }
    catch {
        return error({
            text: "Enter something",
            delay: 2000,
        });
    }
}

function renderImages(images) {
    refs.gallery.insertAdjacentHTML('beforeend', imageCardTpl(images));
    refs.loadMoreBtn.style.display = 'block';
    scrollLoad()

    if (images.length < 12) {
        refs.loadMoreBtn.style.display = 'none';
    }
}

function reset() {
    refs.gallery.innerHTML = '';
}

async function onLoadMore() {
    const images = await imagesApiService.fetchImages();
    renderImages(images)
}

function scrollLoad() {
        refs.container.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
}

refs.gallery.addEventListener('click', imageModal);
function imageModal(e) {
    if (e.target.nodeName !== 'IMG') {
        return;
    }
    const instance = basicLightbox.create(`
    <img src="${e.target.dataset.source}" width="800">
`);
    instance.show();
}