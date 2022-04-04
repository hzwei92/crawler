import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  queue: string[];
  visited: any;
  crawlerMaxCount: number;
  crawlerCount: number;
  eventEmitter: EventEmitter;
  stopAfter: number;
  init(url: string, crawlerCount: number, stopAfter?: number) {
    this.queue = [url];
    this.visited = {};
    this.crawlerMaxCount = crawlerCount;
    this.stopAfter = stopAfter;
    this.crawlerCount = 0;
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on('go', () => {
      while (this.crawlerCount < this.crawlerMaxCount && this.queue.length > this.crawlerCount) {
        this.crawl(this.crawlerCount)
        this.crawlerCount++;
      }
    })
  }

  async crawl(cralwerIndex: number) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    while (this.queue.length) {
      if (this.stopAfter && Object.keys(this.visited).length >= this.stopAfter) {
        return Object.keys(this.visited);
      }
      const url = this.queue.shift();
      if (url && !this.visited[url]) {
        this.visited[url] = true;
        console.log(url)
        await page.goto(url, {
          timeout: 60 * 1000,
        });
        const hrefs = await page.$$eval('[href]', els => els.map((el: any) => el.href));
        hrefs.forEach(href => {
          if (href && typeof href === 'string' && href.match(/^http*/)) {
            console.log('  ' + href)
            this.queue.push(href);
          }
        });
        if (cralwerIndex === 0 && this.crawlerCount < this.crawlerMaxCount) {
          this.eventEmitter.emit('go')
        }
      }
    }
  }
}
