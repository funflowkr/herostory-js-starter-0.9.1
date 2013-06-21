  var Book = StackMob.Model.extend({
    schemaName: 'book'
  });

  var Books = StackMob.Collection.extend({
    model: Book
  });

  var SMQItem = StackMob.Model.extend({
    schemaName: 'smqitem'
  });

  var SMQItems = StackMob.Collection.extend({
    model: SMQItem
  });

  var Attraction = StackMob.Model.extend({
    schemaName: 'attraction'
  });

  var Attractions = StackMob.Collection.extend({
    model: Attraction
  });

  var Post = StackMob.Model.extend ({
    schemaName: 'posts'
  });

  var Posts = StackMob.Collection.extend({
    model: Post
  });

  var StackMobExamples = {};
  var gRoute = "";
  (function() {
    $(document).ready(function() {

      // 기본으로 안 보이도록 해 놓고 상황에 맞춰서 푼다. 
      $('#post_write_container').hide();
      $('#login_container').hide();

      var AppRouter = Backbone.Router.extend({
          routes: {
              "posts/:id": "getPost",
              // <a href="http://example.com/#/posts/121">Example</a>
              
              "write/*text": "writePost",
              // <a href="http://example.com/#/write/하하하하핳 정말 대단하구나?">Download</a>
                
              ":route/:action": "loadView",
              // <a href="http://example.com/#/dashboard/graph">Load Route/Action View</a>
              "*actions": "defaultRoute" // Backbone will try match the route above first
                
          },
          
          getPost: function( id ){ 
              //alert(id); // 121 
              
              StackMobExamples.readPost(id);
              gRoute = "getpost";
          },
          writePost: function( text ){ 
              //alert(text); // user/images/hey.gif 
              StackMobExamples.writePost(text);
              gRoute = "writepost";
              
          },
          loadView: function( route, action ){ 
              alert(route + "_" + action); // dashboard_graph  

          },
          defaultRoute: function( actions ){
              alert( actions ); 
          }
      });
      // Instantiate the router
      var app_router = new AppRouter;
      // Start Backbone history a neccesary step for bookmarkable URL's
      Backbone.history.start();


      
      
      // login 확인 
      StackMob.isLoggedIn({
        yes: function(username){
          console.log(username + " is logged in.");
          StackMobExamples.getUserDetail(username);
          $('#top_logout').show();
          $('#top_login').hide();
          
        },
        no: function(){
          console.log("No one is currently logged in.");
          
          if (gRoute != "getpost") {
            $('#login_container').show();
          }
          $('#post_write_container').hide();
          $('#top_logout').hide();
          $('#top_login').show();
        }
      });

    });
  }).call();

  /*
   * For testing purposes
   */
  StackMobExamples['debugCallback'] = function(txt, s, f) {
    return {
      // NOTE function(model, result)꼴이 맞는거 아닌가? 
      success: function(model,result) {
        txt = txt || '';
        console.debug('------- ' + txt + ' success start-----');
        if (result) {
          var jf = new JSONFormatter((result.toJSON ? result.toJSON() : result), 'pre');
          $('#results').text(result.toJSON || _.isObject(result)? jf.formatJSON() : result);
        } else $('#results').text('No response body. Check your Firebug/Developer Tools Javascript Console.');

        if (s) s(result);
        return result;
      },
      error: function(model, response) {
        txt = txt || '';
        console.debug('------- ' + txt + ' error start-----');
        if (response) {
          var jf = new JSONFormatter(response, 'pre');
          $('#results').text(jf.formatJSON());
        } else $('#results').text('No response body. Check your Firebug/Developer Tools Javascript Console.');

        if (f) f(response);
        return response;
      }
    };
  };
  StackMobExamples['debugCallback2'] = function(txt, s, f) {
    return {
      // NOTE function(model, result)꼴이 맞는거 아닌가? 
      // save  할 때는 위의 함수가 잘 안 먹는다. 
      success: function(result) {
        txt = txt || '';
        console.debug('------- ' + txt + ' success start-----');
        if (result) {
          var jf = new JSONFormatter((result.toJSON ? result.toJSON() : result), 'pre');
          $('#results').text(result.toJSON || _.isObject(result)? jf.formatJSON() : result);
        } else $('#results').text('No response body. Check your Firebug/Developer Tools Javascript Console.');

        if (s) s(result);
        return result;
      },
      error: function(model, response) {
        txt = txt || '';
        console.debug('------- ' + txt + ' error start-----');
        if (response) {
          var jf = new JSONFormatter(response, 'pre');
          $('#results').text(jf.formatJSON());
        } else $('#results').text('No response body. Check your Firebug/Developer Tools Javascript Console.');

        if (f) f(response);
        return response;
      }
    };
  };

// ----------------------------------
// herostory js 
// ----------------------------------

  StackMobExamples['readPost'] = function(posts_id) {
    var posts = new Posts();
    var q = new StackMob.Collection.Query();
    q.setExpand(2);
    //'24bad05feae0413ab96a6960f010267c'
    q.equals('posts_id', posts_id);
    //q.select('sm_owner').select('text').select('imageurl').select('comments').select('comments.*');
    posts.query(q,StackMobExamples.debugCallback('Getting Post Objects', function(result){
      var template = $("#mustache_post_read").html();
      //result[0];
      var viewxx  = result[0];
      viewxx.formateCreatedDate = function () { return function() { return moment(this.createddate).format('LLL'); } }
      viewxx.showImageUrl = function () { return function() { 
        if (this.imageurl) {
          return this.imageurl;
        } else {
          return "http://www.clker.com/cliparts/w/g/R/H/F/g/mustache-hair-th.png";
        }
        //return moment(this.createddate).format('LLL'); } 
      }}
      console.debug(viewxx);
      var output = Mustache.render(template, viewxx);
      $("#post_read_container").html(output);
    }));
    
 
  };

  StackMobExamples['writePost'] = function(text) {
    $('#post_write_container').show();
    $('#post_write_textarea').val(text);
  
  };
  
  
  
  

  var globaluser ;  

  StackMobExamples['getUserDetail'] = function(un) {
    console.log(un);
    var user = new StackMob.User({ username: un});
    user.fetchExpanded(1, StackMobExamples.debugCallback(un,function (result) {
      globaluser=result;
      
      var template = $("#mustache_login").html();
      var output = Mustache.render(template, globaluser);
      $("#login_info").html(output);
      $('#login_container').hide();

      if (gRoute === ("writepost")) {
        $('#post_write_container').show();
      }
    }));
  };
  

  
  /**
   * Testing custom code
   */
  (function() {
    $(document).ready(function() {
      $('#hs_post_write').click(function() {
        if (globaluser != "undefined") {

          StackMob.cc('posts_write', {
            "charactername": globaluser.maincharacter.charactername,
            "characters_id": globaluser.maincharacter.characters_id,
            "post_text": $('#post_write_textarea').val()
          } , 'POST'
          , StackMobExamples.debugCallback2('test posts_write CC',function (result) {
            $('#post_write_container').hide();
            location.href="#/posts/"+result.data[0].posts_id;

          })); 
        } else {
          alert("로그인 하셔야죵");
        }
      });
    });
  }).call();

  (function() {
    $(document).ready(function() {
      $('#hs_comment_write').click(function() {
        StackMob.cc('posts_comment', {
          "charactername": "asdfasdf",
          "characters_id": "asdfasdfasdf",
          "comment_text": "comment text comment text",
          "posts_id":"237e1ef38c6845d2a895c2b08e266b8e"
        } , 'POST'
        , StackMobExamples.debugCallback('test comments_write CC'));
      });
    });
  }).call();

  StackMobExamples['createUser'] = function(username) {
    var user = new StackMob.User({ username: 'Bruce Wayne', password: 'imbatman', age: 50 });
    user.create(StackMobExamples.debugCallback('Creating User: Bruce Wayne'));
  };

  StackMobExamples['fetchUser'] = function(username) {
    var user = new StackMob.User( { username: 'sohnkh@gmail.com' } );
    user.fetchExpanded(1,StackMobExamples.debugCallback('Reading User: Bruce Wayne'));
  };

  StackMobExamples['updateUser'] = function(username) {
    var user = new StackMob.User({ username: 'Bruce Wayne', age: 51 });
    user.save(null, StackMobExamples.debugCallback('Updating User: Bruce Wayne to age 51'));
  };

  StackMobExamples['deleteUser'] = function(username) {
    var user = new StackMob.User({ username: 'Bruce Wayne'});
    user.destroy(StackMobExamples.debugCallback('Delete User: Bruce Wayne'));
  };

  StackMobExamples['login'] = function(un,pwd,iskeepLoggedIn) {
    var user = new StackMob.User({ username: un, password: pwd });

    user.login(iskeepLoggedIn, {
        success: function(model, result, options) {
          console.log(model);
          //globaluser = model;
          StackMobExamples.getUserDetail(model.username);
        },
        error: function(model, result, options) {},
        fullyPopulateUser: true
    });


    /*
    user.login(false, StackMobExamples.debugCallback('Logging in.', function(model) {
      console.debug(model);
      globaluser=model;
    }, function(model, response) {
      console.debug(response);
    }));
  */
  };

  StackMobExamples['logout'] = function() {
    var user = new StackMob.User({ username: globaluser.username });
    user.logout(StackMobExamples.debugCallback('Logging out.'));
  };

  StackMobExamples['createBooks'] = function() {
    var booktitles = ['Lord of the Rings', 'Encyclopedia Brown', 'The Hatchet', 'All Quiet on the Western Front',
      'Harry Potter 1', 'Harry Potter 2', 'Harry Potter 3', 'Harry Potter 4', 'Harry Potter 5', 'Harry Potter 6',
      'Harry Potter 7'];

    _.each(booktitles, function(t) {
      var book = new Book({ title: t, author: 'Bruce Wayne' });
      book.create(StackMobExamples.debugCallback('Creating Book: ' + t));
    });
  };

  StackMobExamples['deleteBooks'] = function() {
    var books = new Books();
    books.fetch(StackMobExamples.debugCallback('Fetching Books', function() {
      var book;
      while(book = books.pop()) {
        book.destroy(StackMobExamples.debugCallback('Deleting book: ' + book.get('title')));
      }
    }));
  };

  StackMobExamples['getQueryItems'] = function() {
    var smqitems = new SMQItems();
    smqitems.fetch(StackMobExamples.debugCallback('Getting all Test Objects'));
  };


  /**
   * Herostory DATA
   */
  (function() {
    $(document).ready(function() {
      
      $('#hs_posts_read').click(function() {
        StackMobExamples.readPost('24bad05feae0413ab96a6960f010267c');
      });

    });
  }).call();


  /**
   * Test User CRUD
   */
  (function() {
    $(document).ready(function() {
      
      $('#createOAuthUser').click(function() {
        var user = new StackMob.User({ username: 'oauthtestuser', password: 'oauthtestpassword' });
        user.create({
          success: function(model) {
            console.debug('USER CREATED');
          }
        });
      });
      
      $('#user_create').click(function() {
        StackMobExamples.createUser();
      });

      $('#user_read').click(function() {
        StackMobExamples.fetchUser();
      });

      $('#user_update').click(function() {
        StackMobExamples.updateUser();
      });

      $('#user_delete').click(function() {
        StackMobExamples.deleteUser();
      });
    });
  }).call();


  /**
   * Testing user methods
   */
  (function() {
    $(document).ready(function() {
      $('#login').click(function() { 
        username = $('#login_email').val();
        password = $('#login_password').val();
        iskeepLoggedIn = $('#keepLoggedIn').is(':checked');
        console.log("username="+username+"/password="+password + "/iskeepLoggedIn="+iskeepLoggedIn);
        
        StackMobExamples.login(username,password,iskeepLoggedIn);
      });
    });

    $(document).ready(function() {
      $('#logout').click(function() {
        StackMobExamples.logout();
        location.reload();
      });
    });
    
    $(document).ready(function() {
      $('#show_login').click(function() {
        $('#login_container').show();
      });
    });
    
  }).call();




  /**
   * Testing new models
   */
   (function() {
    $(document).ready(function() {
      $('#book_createbooks').click(function() {
        StackMobExamples.createBooks();
      });

      $('#book_delete').click(function() {
        StackMobExamples.deleteBooks();
      });
    });
   }).call();

  /**
   * Test StackMob.Collection.Query
   */
  (function() {
    $(document).ready(function() {

      $('#smq_getall').click(function() {
        StackMobExamples.getQueryItems();
      });

      $('#smq_createall').click(function() {
        for(var i = 0; i < 25; i++) {
          var item = new SMQItem({
            number: i,
            numbers: [i, i+1, i+2, i+3],
            mod: (i % 5)
          });

          item.create(StackMobExamples.debugCallback('Creating fake items to test'));
        }
      });

      $('#smq_deleteall').click(function() {
        var smqitems = new SMQItems();
        smqitems.fetch(StackMobExamples.debugCallback('Deleting All SMQ Items', function() {
          var model;
          while(model = smqitems.pop()) {
            model.destroy(StackMobExamples.debugCallback('Deleting: ' + model.get('smqitem_id')));            
          }
        }));
      });


    $('#smq_count').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.equals('number', 15);
        items.count(q, StackMobExamples.debugCallback('Getting Item Number 15 Count'));
      });
      
      $('#smq_equals').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.equals('number', 15);
        items.query(q, StackMobExamples.debugCallback('Getting Item Number 15'));
      });

      $('#smq_notequals').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.notEquals('number', 15).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Item Number != 15'));
      });

      $('#smq_isnull').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.isNull('number');
        items.query(q, StackMobExamples.debugCallback('Getting Items with null number'));
      });

      $('#smq_isnotnull').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.isNotNull('number');
        items.query(q, StackMobExamples.debugCallback('Getting Items with non-null number'));
      });
      
      $('#smq_lt').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.lt('number', 5).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Item Number < 5'));
      });

      $('#smq_lte').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.lte('number', 5).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Item Number <= 5'));
      });

      $('#smq_gt').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.gt('number', 20).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Item Number > 20'));
      });

      $('#smq_gte').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.gte('number', 20).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Item Number >= 20'));
      });

      $('#smq_mustbeoneof').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.mustBeOneOf('number', [1,5,10]).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Item Numbers 1, 5, 10'));
      });

      $('#smq_orderByAsc').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Items in ascending number order'));
      });

      $('#smq_orderByDesc').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.orderDesc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Items in descending number order'));
      });

      $('#smq_range').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.setRange(5, 9).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting Items second page of results '));
      });
      $('#smq_gte_lte_expression').click(function() {
        var items = new SMQItems();
        var q = new StackMob.Collection.Query();
        q.gte('number', 3).lte('number', 5).orderAsc('number');
        items.query(q, StackMobExamples.debugCallback('Getting 3 <= number <= 5'));
      });
    });
  }).call();
  
  (function() {
    function handleFileSelect(evt) {
      var files = evt.target.files; // FileList object
   
      // Loop through the FileList
      for (var i = 0, f; f = files[i]; i++) {
   
        var reader = new FileReader();
   
        // Closure to capture the file information
        reader.onload = (function(theFile) {
          return function(e) {
   
            /*
              e.target.result will return "data:image/jpeg;base64,[base64 encoded data]...".
              We only want the "[base64 encoded data] portion, so strip out the first part
            */
            var base64Content = e.target.result.substring(e.target.result.indexOf(',') + 1, e.target.result.length);
            var fileName = theFile.name;
            var fileType = theFile.type;
   
            var user = new StackMob.User({ username: 'Bruce Wayne' });
            user.fetch({
              success: function(model) {
                
                theUser = model;
                theUser.setBinaryFile('pic', fileName, fileType, base64Content);
                
                theUser.save(StackMobExamples.debugCallback('Saving the binary file to the user'));  
              }
            });
            
   
          };
        })(f);
   
        // Read in the file as a data URL
        fileContent = reader.readAsDataURL(f);
   
      }
    }
    
    $(document).ready(function() {
      document.getElementById('files').addEventListener('change', handleFileSelect, false); 
    });
  }).call();



  /**
   * Testing with Facebook
   */
  
  /**
   * Testing custom code
   */
  (function() {
    $(document).ready(function() {
      $('#cc_helloworld').click(function() {
        StackMob.cc('hello_world', {}, StackMobExamples.debugCallback('Testing CC'));
      });
    });
  }).call();

  (function() {
    $(document).ready(function() {
      $('#cc_withparams').click(function() {
        var params = { second_string: 1, first_string: 2 };
        StackMob.cc('has_params_method', params, StackMobExamples.debugCallback('Testing CC with params'));
      });
    });
  }).call();

  /**
   *  Testing Arrays
   */
  (function() {
    $(document).ready(function() {
      var Message = StackMob.Model.extend({
        schemaName: 'message'
      });

      var Messages = StackMob.Collection.extend({
        model: Message
      });

      $('#rel_createuser').click(function() {
        var user = new StackMob.User({ 'username': 'Mr. Rogers', 'password': 'hello' });
        user.create(StackMobExamples.debugCallback('Creating user Mr. Rogers.'));
      });

      $('#rel_deleteuser').click(function() {
        var user = new StackMob.User({ 'username': 'Mr. Rogers'});
        user.destroy(StackMobExamples.debugCallback('Delete Mr. Rogers'));
      });

      $('#rel_appendandcreate').click(function() {
        var user = new StackMob.User({ 'username': 'Mr. Rogers' });
        user.fetch(StackMobExamples.debugCallback('Fetching Mr. Rogers', function() {

          var msgs = [];
          for (var i = 0; i < 10; i++) {
            msgs.push(new Message({ 'content': 'Hello World ' + i + '!'}));
          }

          user.appendAndCreate('messages', msgs, StackMobExamples.debugCallback('Sending 10 messages "Hello World [int]" and creating/appending to Mr. Rogers "messages" field.', function() {
            var q = new StackMob.Collection.Query();
            q.equals('username', 'Mr. Rogers').setExpand(1);
            var users = new StackMob.Users();
            users.query(q, StackMobExamples.debugCallback('Fetching expanded Mr. Rogers to show that he now has 10 messages'));

          }));
        }));
      });

      $('#rel_getmsgs').click(function() {
        var messages = new Messages();
        messages.fetch(StackMobExamples.debugCallback('Fetching all messages to show they were created.'));
      });

      $('#rel_deletemsgs').click(function() {
        var msgs = new Messages();
        msgs.fetch(StackMobExamples.debugCallback('Getting all messages', function() {
          var model;
          while(msg = msgs.pop())
            msg.destroy(StackMobExamples.debugCallback('Deleting message: ' + msg.get('message_id')));
        }));
      });

      $('#rel_appendandsave').click(function() {
        var user = new StackMob.User({ 'username': 'Mr. Rogers'});
        user.fetch(StackMobExamples.debugCallback('Fetching Mr. Rogers', function() {
          var msg = new Message({ 'content': 'New Message'});

          msg.create(StackMobExamples.debugCallback('Creating Message now.', function() {
              user.appendAndSave('messages', [msg.get('message_id')], StackMobExamples.debugCallback('Appending and Saving'));
          }));
        }));

      });

      $('#rel_deleteandsave').click(function() {
        var user = new StackMob.User({'username': 'Mr. Rogers'});
        user.fetch(StackMobExamples.debugCallback('Fetching Mr. Rogers', function() {
          user.deleteAndSave('messages', user.get('messages'), StackMob.SOFT_DELETE, StackMobExamples.debugCallback('Deleting references to messages only.', function() {
            user.fetch(StackMobExamples.debugCallback('Showing Mr. Rogers after soft deleting message references.  Messages should still exist in datastore'));
          }));
        }));
      });

      $('#rel_harddeleteandsave').click(function() {
        var user = new StackMob.User({'username': 'Mr. Rogers'});
        user.fetch(StackMobExamples.debugCallback('Fetching Mr. Rogers', function() {
          user.deleteAndSave('messages', user.get('messages'), StackMob.HARD_DELETE, StackMobExamples.debugCallback('Deleting references to messages only.', function() {
            user.fetch(StackMobExamples.debugCallback('Showing Mr. Rogers after soft deleting message references.  Messages should still exist in datastore'));
          }));
        }));
      });

      $('#rel_getuser').click(function() {
        var user = new StackMob.User({ username: 'Mr. Rogers'});
        user.fetch(StackMobExamples.debugCallback('Fetching Mr. Rogers'));
      });

      $('#rel_getuserexpanded').click(function() {
        var user = new StackMob.User({ username: 'Mr. Rogers'});
        user.fetchExpanded(1, StackMobExamples.debugCallback('Fetching Mr. Rogers'));
      });
    });
  }).call();
