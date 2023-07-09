import puppeteer from "puppeteer";
import {parse} from 'node-html-parser';
import express, {json} from "express"
import cors from "cors"
const getFuelPrices = async () => {

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto('https://www.autocentrum.pl/paliwa/ceny-paliw/');
    var pb = await page.$("[class='fuels-wrapper choose-petrol']");
    if (!pb) {
        return
    }
    const title = await page.evaluate(el => el.innerHTML, await page.$("[class='fuels-wrapper choose-petrol']"));
    const root = parse(title);

    const [oktan95, oktan98, on, onPlus, lpg] = root.querySelectorAll(".price").map(i => i.innerText.trim().slice(0, 4).replace(",","."))

    await browser.close();

    return {
        oktan95, oktan98, on, onPlus, lpg
    }
};

const app = express()
app.use(json())
app.use(cors())
app.get('/', async (req, res) => {
    const petrolPrice = await getFuelPrices()
    res.send(petrolPrice)
})
const server = app.listen(4200);
console.log("LISTEN")
