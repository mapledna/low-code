export default [
  {
    path: "/Desk",
    name: "Desk",
    component: () =>
      import(
        /* webpackChunkName: "module-desk" */ "@/views/pages/ControlDesk.vue"
      ),
  },
  {
    path: "/MainPage",
    name: "MainPage",
    meta: {
      title: "云平台主页",
    },
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/Main.vue"),
  },
  {
    path: "/Info/Config",
    name: "InfoConfig",
    meta: {
      title: "可配置化软件开发平台",
    },
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/Config.vue"),
  },
  {
    path: "/Info/CloudWarehouse",
    name: "CloudWarehouse",
    meta: {
      title: "XXXXX",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/CloudWarehouse.vue"
      ),
  },
  {
    path: "/Info/clmis",
    name: "clmis",
    meta: {
      title: "物流管控平台",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/LogisticsMIS.vue"
      ),
  },
  {
    path: "/Info/clmisPh",
    name: "clmisPh",
    meta: {
      title: "物流管控平台",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/LogisticsMISPh.vue"
      ),
  },
  {
    path: "/Info/cwms",
    name: "cwms",
    meta: {
      title: "云仓储管理系统",
    },
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/Cloudwms.vue"),
  },
  {
    path: "/ProductDetail",
    name: "ProductDetail",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/ProductDetail.vue"
      ),
  },
  {
    path: "/TransDetail",
    name: "TransDetail",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/TransDetail.vue"
      ),
  },
  {
    path: "/Info/SupplyChain",
    name: "SupplyChain",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/SupplyChain.vue"
      ),
  },
  {
    path: "/Solution",
    name: "Solution",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/Solution.vue"),
  },
  {
    path: "/SmartLogist",
    name: "SmartLogist",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/SmartLogist.vue"
      ),
  },
  {
    path: "/Info/Datasmart",
    name: "Datasmart",
    meta: {
      title: "大数据开发平台",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/Datasmart.vue"
      ),
  },
  {
    path: "/Info/DataAnalysis",
    name: "DataAnalysis",
    meta: {
      title: "数据分析",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/DataAnalysis.vue"
      ),
  },
  {
    path: "/Info/DataScreen",
    name: "DataScreen",
    meta: {
      title: "数据大屏",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/DataScreen.vue"
      ),
  },
  {
    path: "/Info/ReportAssistant",
    name: "ReportAssistant",
    meta: {
      title: "报表助手",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/ReportAssistant.vue"
      ),
  },
  {
    path: "/BusinessPlatform",
    name: "BusinessPlatform",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/BusinessPlatform.vue"
      ),
  },
  {
    path: "/DataPlatform",
    name: "DataPlatform",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/DataPlatform.vue"
      ),
  },
  {
    path: "/Partner",
    name: "Partner",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/Partner.vue"),
  },
  {
    path: "/Help",
    name: "Help",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/pages/Helper.vue"),
  },
  {
    path: "/About",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/About.vue"),
  },
  {
    path: "/Info/Datasmart",
    name: "Datasmart",
    meta: {
      title: "大数据开发平台",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/Datasmart.vue"
      ),
  },
  {
    path: "/Info/configPh",
    name: "configPh",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/ConfigPh.vue"),
    meta: {
      title: "可配置化软件开发平台",
    },
  },
  {
    path: "/Info/DatasmartPh",
    name: "DatasmartPh",
    meta: {
      title: "大数据开发平台",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/DatasmartPh.vue"
      ),
  },
  {
    path: "/Info/DataAnalysisPh",
    name: "DataAnalysisPh",
    meta: {
      title: "数据分析",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/DataAnalysisPh.vue"
      ),
  },
  {
    path: "/Info/DataScreenPh",
    name: "DataScreenPh",
    meta: {
      title: "数据大屏",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/DataScreenPh.vue"
      ),
  },
  {
    path: "/Info/ReportAssistantPh",
    name: "ReportAssistantPh",
    meta: {
      title: "报表助手",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/ReportAssistantPh.vue"
      ),
  },
  {
    path: "/Info/CloudWarehousePh",
    name: "CloudWarehousePh",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/CloudWarehousePh.vue"
      ),
    meta: {
      title: "XXXXX",
    },
  },
  {
    path: "/Info/SupplyChainPh",
    name: "SupplyChainPh",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/SupplyChainPh.vue"
      ),
    meta: {
      title: "供应链管理系统",
    },
  },
  {
    path: "/Info/cloudwmsPh",
    name: "cloudwmsPh",
    meta: {
      title: "云仓储管理系统",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/CloudwmsPh.vue"
      ),
  },
  {
    path: "/Info/QuotationExpertPh",
    name: "SupplyChainPh",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/QuotationExpertPh.vue"
      ),
    meta: {
      title: "供应链管理系统",
    },
  },
  {
    path: "/Info/Cost",
    name: "Cost",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/Cost.vue"),
  },
  {
    path: "/Info/cwcs",
    name: "cwcs",
    meta: {
      title: "CWCS系统",
    },
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/iwcs.vue"),
  },
  {
    path: "/Info/DigitalTwins",
    name: "DigitalTwins",
    meta: {
      title: "数字孪生系统",
    },
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/DigitalTwins.vue"
      ),
  },
  {
    path: "/Info/ctms",
    name: "ctms",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/TMS.vue"),
  },
  {
    path: "/Info/QuotationExpert",
    name: "QuotationExpert",
    component: () =>
      import(
        /* webpackChunkName: "module-info" */ "@/views/info/QuotationExpert.vue"
      ),
    meta: {
      title: "报价专家",
    },
  },
  {
    path: "/Info/ctmsPh",
    name: "ctmsPh",
    meta: {
      title: "运输管理系统",
    },
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/TMSPh.vue"),
  },
  {
    path: "/Info/crm",
    name: "crm",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/Crm.vue"),
    meta: {
      title: "客户关系管理系统",
    },
  },
  {
    path: "/Info/crmPh",
    name: "crmPh",
    component: () =>
      import(/* webpackChunkName: "module-info" */ "@/views/info/CrmPh.vue"),
    meta: {
      title: "客户关系管理系统",
    },
  },
];
