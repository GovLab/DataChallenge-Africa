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
      currentDate: '',

      apiURL: 'https://directus.thegovlab.com/datachallenge_africa',

    }
  },

  created: function created() {
    this.blogslug=window.location.href.split('/');
    this.blogslug = this.blogslug[this.blogslug.length - 1];
    console.log(this.blogslug);
    this.fetchBlog();
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
    },
    fetchBlog() {
      self = this;
      const client = new DirectusSDK({
        url: "https://directus.thegovlab.com/",
        project: "datachallenge_africa",
        storage: window.localStorage
      });

      client.getItems(
  'blog',
  {
    sort:"-created",
    filter: {
      slug: self.blogslug
    },
    fields: ['*.*']
  }
  ).then(data => {

    self.blogData = data.data;
  })
.catch(error => console.error(error));
    },
    formatDate(date) {
      return moment(date).format('DD MMMM YYYY');
    },
    currentDateTime() {
    var currentTime = moment();
    return currentTime.tz('America/New_York').format('YYYY-MM-DD h:mm:ss');
    }
}
});


