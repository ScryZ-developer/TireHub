"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABBITMQ_QUEUES = exports.SERVICE_PORTS = exports.WeatherState = exports.TireSeason = exports.PartnerType = exports.OrderStatus = exports.ProductType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["BUYER"] = "buyer";
    UserRole["ADMIN"] = "admin";
    UserRole["PARTNER"] = "partner";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProductType;
(function (ProductType) {
    ProductType["TIRE"] = "tire";
    ProductType["WHEEL"] = "wheel";
})(ProductType || (exports.ProductType = ProductType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PAID"] = "paid";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PartnerType;
(function (PartnerType) {
    PartnerType["STORE"] = "store";
    PartnerType["TIRE_SERVICE"] = "tire_service";
    PartnerType["PICKUP_POINT"] = "pickup_point";
})(PartnerType || (exports.PartnerType = PartnerType = {}));
var TireSeason;
(function (TireSeason) {
    TireSeason["SUMMER"] = "summer";
    TireSeason["WINTER"] = "winter";
    TireSeason["ALL_SEASON"] = "all_season";
})(TireSeason || (exports.TireSeason = TireSeason = {}));
var WeatherState;
(function (WeatherState) {
    WeatherState["COLD"] = "cold";
    WeatherState["WARNING"] = "warning";
    WeatherState["SUMMER"] = "summer";
    WeatherState["HEAT"] = "heat";
})(WeatherState || (exports.WeatherState = WeatherState = {}));
exports.SERVICE_PORTS = {
    CORE: 3001,
    CATALOG: 3002,
    CONSUMER: 3003,
    RECOMMENDATION: 3004,
    WEB: 3000,
};
exports.RABBITMQ_QUEUES = {
    NOTIFICATIONS: 'notifications',
    ORDER_EVENTS: 'order.events',
    CATALOG_SYNC: 'catalog.sync',
};
//# sourceMappingURL=index.js.map