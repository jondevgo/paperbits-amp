import { PagesToolButton } from "./workshops/page/ko/pagesToolButton";
import { IInjectorModule, IInjector } from "@paperbits/common/injection";
import { PagesWorkshop } from "./workshops/page/ko/pages";
import { PageDetailsWorkshop } from "./workshops/page/ko/pageDetails";
import { PageSelector } from "./workshops/page/ko/pageSelector";
import { PageHost } from "./workshops/page/ko/pageHost";
import { AmpPageService, AmpPageHyperlinkProvider } from "./services/page";
import { PictureDesignModule } from "./widgets/picture/ko";
import { CollapsiblePanelDesignModule } from "./widgets/collapsible-panel";
import { AmpPagePermalinkResolver } from "./pagePermalinkResolver";


export class PageDesignModule implements IInjectorModule {
    public register(injector: IInjector): void {
        injector.bind("ampPageHost", PageHost);
        injector.bind("ampPagesWorkshop", PagesWorkshop);
        injector.bind("ampPageDetailsWorkshop", PageDetailsWorkshop);
        injector.bind("ampPageSelector", PageSelector);
        injector.bindToCollection("workshopSections", PagesToolButton);
        injector.bind("ampPageService", AmpPageService);
        injector.bindModule(new PictureDesignModule());
        injector.bindModule(new CollapsiblePanelDesignModule());
        injector.bindToCollection("hyperlinkProviders", AmpPageHyperlinkProvider);
        injector.bindToCollection("permalinkResolvers", AmpPagePermalinkResolver);
    }
}