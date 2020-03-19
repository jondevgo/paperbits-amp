import { HyperlinkContract } from "@paperbits/common/editing";
import { IPermalinkResolver, HyperlinkModel } from "@paperbits/common/permalinks";
import { IPageService, PageContract } from "@paperbits/common/pages";


export class AmpPagePermalinkResolver implements IPermalinkResolver {
    constructor(private readonly pageService: IPageService) { }

    public canHandleTarget(targetKey: string): boolean {
        return targetKey.startsWith("amp-pages/");
    }

    public async getUrlByTargetKey(targetKey: string, locale?: string): Promise<string> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith("pages/")) {
            return null;
        }

        const contentItem = await this.pageService.getPageByKey(targetKey, locale);

        if (!contentItem) {
            throw new Error(`Could not find permalink with key ${targetKey}.`);
        }

        return contentItem.permalink;
    }

    private async getHyperlink(pageContract: PageContract, target: string = "_self"): Promise<HyperlinkModel> {
        const hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.targetKey = pageContract.key;
        hyperlinkModel.href = pageContract.permalink;
        hyperlinkModel.title = pageContract.title || pageContract.permalink;
        hyperlinkModel.target = target;

        return hyperlinkModel;
    }

    public async getHyperlinkFromContract(hyperlinkContract: HyperlinkContract, locale?: string): Promise<HyperlinkModel> {
        if (!hyperlinkContract.targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!hyperlinkContract.targetKey.startsWith("pages/")) {
            return null;
        }

        let hyperlinkModel: HyperlinkModel;

        if (hyperlinkContract.targetKey) {
            const pageContract = await this.pageService.getPageByKey(hyperlinkContract.targetKey, locale);

            if (pageContract) {
                return this.getHyperlink(pageContract, hyperlinkContract.target);
            }
        }

        hyperlinkModel = new HyperlinkModel();
        hyperlinkModel.title = "Unset link";
        hyperlinkModel.target = hyperlinkContract.target;
        hyperlinkModel.targetKey = null;
        hyperlinkModel.href = "#";
        hyperlinkModel.anchor = hyperlinkContract.anchor;

        return hyperlinkModel;
    }

    public async getHyperlinkByTargetKey(targetKey: string, locale?: string): Promise<HyperlinkModel> {
        if (!targetKey) {
            throw new Error("Target key cannot be null or empty.");
        }

        if (!targetKey.startsWith("pages/")) {
            return null;
        }

        const contentItem = await this.pageService.getPageByKey(targetKey, locale);

        if (!contentItem) {
            return null;
        }

        const hyperlink = await this.getHyperlink(contentItem);

        return hyperlink;
    }
}