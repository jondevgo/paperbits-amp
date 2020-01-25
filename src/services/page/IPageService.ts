﻿import { Contract } from "@paperbits/common";
import { PageContract } from "../page/pageContract";

/**
 * Service for managing pages.
 */
export interface IPageService {
    /**
     * Searches for pages that contain specified pattern in their title, description or keywords.
     * @param pattern {string} Search pattern.
     */
    search(pattern: string): Promise<PageContract[]>;

    /**
     * Returns page by specified key.
     * @param key {string} Unique page identifier.
     */
    getPageByKey(key: string): Promise<PageContract>;

    /**
     * Returns page with specified permalink.
     * @param permalink {string} Permanent link of the page, e.g. /about.
     */
    getPageByPermalink(permalink: string): Promise<PageContract>;

    /**
     * Deletes specified page from store.
     * @param page {PageContract} Contract describing page metadata.
     */
    deletePage(page: PageContract): Promise<void>;

    /**
     * Creates a new page in store and returns its contract.
     * @param permalink {string} Permanent link of the page, e.g. /about.
     * @param title {string} Page title.
     * @param description {string} Page description.
     * @param keywords {string} Page keywords.
     */
    createPage(permalink: string, title: string, description: string, keywords: string): Promise<PageContract>;

    /**
     * Updates a page.
     * @param page {PageContract} Contract describing page metadata.
     */
    updatePage(page: PageContract): Promise<void>;

    /**
     * Returns page content by specified key.
     * @param pageKey {string}
     */
    getPageContent(pageKey: string): Promise<Contract>;

    /**
     * Updates page content.
     * @param pageKey {string} Key of the page.
     * @param document {Contract} Contract describing content of the page.
     */
    updatePageContent(pageKey: string, document: Contract): Promise<void>;
}
