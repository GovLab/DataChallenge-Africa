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
      winnersData:[],
      insightData: [],
      DomainData: [],
      QuestionData: [],
      KeyInformationData: [],
      ActionableInsightsData: [],
      alertData: [],
      blogData: [],
      currentDate: '',
      DocuData: [],
      privacyData:[],
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
    this.fetchKeyInformation();
    this.fetchAlerts();
    this.fetchDocuments();
    this.fetchActionableInsights();
    this.toggleMessage();
    this.fetchPrivacy();
    this.fetchWinners();
    this.fetchBlog();
  },
  methods: {

    fetchIndex() {
      self = this;
      fetch('/data/splash-page-local.json')
        .then(response => response.json())
        .then(data => {
          self.indexData = data.data;
        })
        .catch(error => {
          console.error('Error loading splash page data:', error);
          // Fallback to API if local file fails
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
        });
    },
    formatDate(date) {
      return moment(date).format('DD MMMM YYYY');
    },
    currentDateTime() {
    var currentTime = moment();
    return currentTime.tz('America/New_York').format('YYYY-MM-DD h:mm:ss');
    },
    fetchBlog() {
      self = this;
      fetch('/data/blog-local.json')
        .then(response => response.json())
        .then(data => {
          self.blogData = data.data;
        })
        .catch(error => {
          console.error('Error loading blog data:', error);
          // Fallback to API if local file fails
          const client = new DirectusSDK({
            url: "https://directus.thegovlab.com/",
            project: "datachallenge_africa",
            storage: window.localStorage
          });

          client.getItems(
            'blog',
            {
              sort:"-created",
              fields: ['*.*']
            }
          ).then(data => {
            self.blogData = data.data;
          })
          .catch(error => console.error(error));
        });
    },
    fetchWinners() {
      self = this;
      fetch('/data/winners-local.json')
        .then(response => response.json())
        .then(data => {
          self.winnersData = data.data;
        })
        .catch(error => {
          console.error('Error loading winners data:', error);
          // Fallback to API if local file fails
          const client = new DirectusSDK({
            url: "https://directus.thegovlab.com/",
            project: "datachallenge_africa",
            storage: window.localStorage
          });

          client.getItems(
            'winners',
            {
              fields: ['*.*']
            }
          ).then(data => {
            self.winnersData = data.data;
          })
          .catch(error => console.error(error));
        });
    },
    fetchPrivacy() {
      self = this;
      fetch('/data/privacy-local.json')
        .then(response => response.json())
        .then(data => {
          self.privacyData = data.data;
        })
        .catch(error => {
          console.error('Error loading privacy data:', error);
          // Fallback to API if local file fails
          const client = new DirectusSDK({
            url: "https://directus.thegovlab.com/",
            project: "datachallenge_africa",
            storage: window.localStorage
          });

          client.getItems(
            'privacy_policy',
            {
              fields: ['*.*']
            }
          ).then(data => {
            self.privacyData = data.data;
          })
          .catch(error => console.error(error));
        });
    },
    fetchInsights() {
      self = this;
      fetch('/data/insights-local.json')
        .then(response => response.json())
        .then(data => {
          self.insightData = data.data;
        })
        .catch(error => {
          console.error('Error loading insights data:', error);
          // Fallback to API if local file fails
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
        });
    },
    fetchDomains() {
      self = this;
      fetch('/data/domains-local.json')
        .then(response => response.json())
        .then(data => {
          self.DomainData = data.data;
        })
        .catch(error => {
          console.error('Error loading domains data:', error);
          // Fallback to API if local file fails
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
        });
    },
    fetchQuestions() {
      self = this;
      fetch('/data/faq-local.json')
        .then(response => response.json())
        .then(data => {
          self.QuestionData = data.data;
        })
        .catch(error => {
          console.error('Error loading FAQ data:', error);
          // Fallback to API if local file fails
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
        });
    },
    fetchKeyInformation() {
      self = this;
      fetch('/data/key-information-local.json')
        .then(response => response.json())
        .then(data => {
          self.KeyInformationData = data.data;
        })
        .catch(error => {
          console.error('Error loading key information data:', error);
          // Fallback to API if local file fails
          const client = new DirectusSDK({
            url: "https://directus.thegovlab.com/",
            project: "datachallenge_africa",
            storage: window.localStorage
          });

          client.getItems(
            'key_information',
            {
              fields: ['*.*']
            }
          ).then(data => {
            self.KeyInformationData = data.data;
          })
          .catch(error => console.error(error));
        });
    },
    fetchActionableInsights() {
      self = this;
      fetch('/data/actionable-insights-local.json')
        .then(response => response.json())
        .then(data => {
          self.ActionableInsightsData = data.data;
        })
        .catch(error => {
          console.error('Error loading actionable insights data:', error);
          // Fallback to API if local file fails
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
        });
    },
    fetchAlerts() {
      self = this;
      fetch('/data/alerts-local.json')
        .then(response => response.json())
        .then(data => {
          self.alertData = data.data;
        })
        .catch(error => {
          console.error('Error loading alerts data:', error);
          // Fallback to API if local file fails
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
          })
          .catch(error => console.error(error));
        });
    },
    fetchDocuments() {
      self = this;
      fetch('/data/documents-local.json')
        .then(response => response.json())
        .then(data => {
          self.DocuData = data.data;
        })
        .catch(error => {
          console.error('Error loading documents data:', error);
          // Fallback to API if local file fails
          const client = new DirectusSDK({
            url: "https://directus.thegovlab.com/",
            project: "datachallenge_africa",
            storage: window.localStorage
          });

          client.getItems(
            'documents',
            {
              fields: ['*.*']
            }
          ).then(data => {
            self.DocuData = data.data;
          })
          .catch(error => console.error(error));
        });
    },
    toggleMessage (index) {
      this.index_active = index;
    	this.showMessage = !this.showMessage
    }
}
});


