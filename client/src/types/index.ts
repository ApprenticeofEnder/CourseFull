import {
    ApiEndpoints,
    AuthEndpoints,
    LegalEndpoints,
    PageEndpoints,
} from '@/types/enums';

export * from './dto';
export * from './data';
export * from './enums';
export * from './home';
export * from './props';
export * from './service';

export class Endpoints {
    static Auth = AuthEndpoints;
    static Api = ApiEndpoints;
    static Page = PageEndpoints;
    static Legal = LegalEndpoints;
}
