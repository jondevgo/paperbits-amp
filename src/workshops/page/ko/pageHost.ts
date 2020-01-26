import * as ko from "knockout";
import { Component, OnMounted, OnDestroyed, Param } from "@paperbits/common/ko/decorators";
import { Router, Route } from "@paperbits/common/routing";
import { EventManager } from "@paperbits/common/events";
import { ViewManager, ViewManagerMode } from "@paperbits/common/ui";
import { ContentViewModelBinder, ContentViewModel } from "@paperbits/core/content/ko";
import { ILayoutService } from "@paperbits/common/layouts";
import { IPageService } from "@paperbits/common/pages";


@Component({
    selector: "amp-page-host",
    template: "<!-- ko if: contentViewModel --><!-- ko widget: contentViewModel, grid: {} --><!-- /ko --><!-- /ko -->"
})
export class PageHost {
    public readonly contentViewModel: ko.Observable<ContentViewModel>;

    constructor(
        private readonly contentViewModelBinder: ContentViewModelBinder,
        private readonly router: Router,
        private readonly eventManager: EventManager,
        private readonly viewManager: ViewManager,
        private readonly layoutService: ILayoutService,
        private readonly pageService: IPageService
    ) {
        this.contentViewModel = ko.observable();
        this.pagePostKey = ko.observable();
    }

    @Param()
    public pagePostKey: ko.Observable<string>;

    @OnMounted()
    public async initialize(): Promise<void> {
        await this.refreshContent();

        this.router.addRouteChangeListener(this.onRouteChange);
        this.eventManager.addEventListener("onDataPush", () => this.onDataPush());
    }

    /**
     * This event occurs when data gets pushed to the storage. For example, "Undo" command restores the previous state.
     */
    private async onDataPush(): Promise<void> {
        if (this.viewManager.mode === ViewManagerMode.selecting || this.viewManager.mode === ViewManagerMode.selected) {
            await this.refreshContent();
        }
    }

    private async refreshContent(): Promise<void> {
        this.viewManager.setShutter();

        const route = this.router.getCurrentRoute();
        const pageContract = await this.pageService.getPageByPermalink(route.path);
        const pageContentContract = await this.pageService.getPageContent(pageContract.key);

        this.pagePostKey(pageContract.key);

        const bindingContext = {
            navigationPath: route.path,
            routeKind: "page",
            page: pageContentContract, // TODO: Rename "page" > "content",
            update: "page",
            onContentUpdate: async (updatedPostContract) => {
                await this.pageService.updatePageContent(pageContract.key, updatedPostContract);
            }
        };

        const layoutContract = await this.layoutService.getLayoutByPermalink(route.path);
        const layoutContentContract = await this.layoutService.getLayoutContent(layoutContract.key);
        const contentViewModel = await this.contentViewModelBinder.getContentViewModelByKey(layoutContentContract, bindingContext);

        this.contentViewModel(contentViewModel);

        this.viewManager.removeShutter();
    }

    private async onRouteChange(route: Route): Promise<void> {
        if (route.previous && route.previous.path === route.path) {
            return;
        }

        await this.refreshContent();
    }

    @OnDestroyed()
    public dispose(): void {
        this.router.removeRouteChangeListener(this.onRouteChange);
    }
}