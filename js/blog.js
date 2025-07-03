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

      blogData: [],
      alertData: [],
      currentDate: '',

      apiURL: 'https://directus.thegovlab.com/datachallenge_africa',

    }
  },

  created: function created() {
    this.blogslug=window.location.href.split('/');
    this.blogslug = this.blogslug[this.blogslug.length - 1];
    console.log(this.blogslug);
    this.fetchBlog();
    this.fetchAlerts();
  },
  methods: {

    formatDate(date) {
      return moment(date).format('DD MMMM YYYY');
    },
    currentDateTime() {
    var currentTime = moment();
    return currentTime.tz('America/New_York').format('YYYY-MM-DD h:mm:ss');
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
    fetchBlog() {
      self = this;
      fetch('/data/blog-local.json')
        .then(response => response.json())
        .then(data => {
          // Filter by slug
          self.blogData = data.data.filter(blog => blog.slug === self.blogslug);
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
              filter: {
                slug: self.blogslug
              },
              fields: ['*.*']
            }
          ).then(data => {
            self.blogData = data.data;
          })
          .catch(error => console.error(error));
        });
    }
}
});


