////////////////////////////////////////
// reload page after Forward and back
///////////////////////////////////////

const TYPE_BACK_FORWARD = 2;

function isReloadedPage() {
  return performance.navigation.type === TYPE_BACK_FORWARD;
}

function main() {
  if (isReloadedPage()) {
    window.location.reload();
  }
}
main();

////////////////////////////////////////////////////////////
///// TEAM  API REQUEST ` `
////////////////////////////////////////////////////////////


Vue.use(VueMeta);

new Vue({
    
  el: '#home-page',
    
  data () {
  
    return {
      indexData: [],
      insightData: [],
      DomainData: [],
      QuestionData: [],
      ActionableInsightsData: [],
      alertData: [],
      showMessage: true,
      index_active:0,
      apiURL: 'https://directus.thegovlab.com/datachallenge_africa',

    }
  },

  created: function created() {
    this.fetchIndex();
    this.fetchInsights();
    this.fetchDomains();
    this.fetchQuestions();
    this.fetchAlerts();
    this.fetchActionableInsights();
    this.toggleMessage();
  
  },
  methods: {

    fetchIndex() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "datachallenge_africa",
        storage: window.localStorage
      });

      client.getItems(
  'splash_page_text',
  {
    fields: ['*.*']
  }
  ).then(data => {

    self.indexData = data.data;
  })
.catch(error => console.error(error));
    },
    fetchInsights() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "datachallenge_africa",
        storage: window.localStorage
      });

      client.getItems(
  'insights',
  {
    fields: ['*.*']
  }
  ).then(data => {

    self.insightData = data.data;
  })
.catch(error => console.error(error));
    },
    fetchDomains() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "datachallenge_africa",
        storage: window.localStorage
      });

      client.getItems(
  'domains',
  {
    fields: ['*.*']
  }
  ).then(data => {

    self.DomainData = data.data;
  })
.catch(error => console.error(error));
    },
    fetchQuestions() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "datachallenge_africa",
        storage: window.localStorage
      });

      client.getItems(
  'faq',
  {
    fields: ['*.*']
  }
  ).then(data => {

    self.QuestionData = data.data;
  })
.catch(error => console.error(error));
    },
    fetchActionableInsights() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "datachallenge_africa",
        storage: window.localStorage
      });

      client.getItems(
  'actionable_insights_list',
  {
    fields: ['*.*']
  }
  ).then(data => {

    self.ActionableInsightsData = data.data;
  })
.catch(error => console.error(error));
    },
    fetchAlerts() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "datachallenge_africa",
        storage: window.localStorage
      });

      client.getItems(
  'alert_banner',
  {
    fields: ['*.*']
  }
).then(data => {
  self.alertData = data.data;
  console.log(self.alertData);
})

.catch(error => console.error(error));
    },
    toggleMessage (index) {
      this.index_active = index;
    	this.showMessage = !this.showMessage
    }
}
});


