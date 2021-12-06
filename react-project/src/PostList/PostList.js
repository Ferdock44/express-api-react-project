import React from 'react';
import Post from './Post';
import $ from "jquery";

class PostList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        titleTextboxValue: "",
        urlTextboxValue: "",
        isLoaded: false,
        error: null,
        data: [],
      };
  
      this.handleAddButtonPress = this.handleAddButtonPress.bind(this);
      this.handleTitleTextboxChange = this.handleTitleTextboxChange.bind(this);
      this.handleUrlTextboxChange = this.handleUrlTextboxChange.bind(this);
      this.handleUpvote = this.handleUpvote.bind(this);
      this.handleDownvote = this.handleDownvote.bind(this);
    }

    componentDidMount(){
      //Part 1: Remove this hardcoded stuff and retrieve the data
      //from your Post API
      //- if loading succeeds make sure you set isLoaded to true in the state
      //- if loading fails set isLoaded to true AND error to true in the state
      function compare(a, b) {
        if (a.points < b.points) return 1;
        if (b.points < a.points) return -1;
        return 0;
      }

      let self = this;
      $.ajax("http://localhost:5000/posts").done(function(posts){
        posts.sort(compare);
        self.setState(function(state){
          return { data: posts, isLoaded: true };
        })
      })
      .fail(function(){
        self.setState(function(state){
          return { isLoaded: true, error: true };
        })
      });

      // let newData = [
      //   { id: 1, title: "Apple releases new M1 based Macbooks and Mac Mini", url: "https://www.apple.com/mac/m1/", points: 98 },
      //   { id: 2, title: "C++ for Dummies", url: "https://www.dummies.com/programming/cpp/", points: 0 },
      //   { id: 3, title: "Automate the Boring Stuff with Python", url: "https://automatetheboringstuff.com/", points: 90 },
      //   { id: 4, title: "New version of TailwindCSS released", url: "https://tailwindcss.com/", points: 90 }
      // ];

      // this.setState(function(state){
      //   return { data: newData, isLoaded: true };
      // })
    }
  
    handleAddButtonPress() {
      //Part 2:
      //- Add the post to the API via AJAX call
      // -- if the call succeeds, add the copy of the post you receive from the API
      // to your local copy of the data
      // -- if an error occurs set error to true in the state

      let newData = this.state.data;
      let post = {
        title: this.state.titleTextboxValue,
        url: this.state.urlTextboxValue
      }

      let self = this;
      $.ajax({
        method: "POST",
        url: "http://localhost:5000/posts",
        data: post
      })
      // For some reason this will go to fail instead of done even when it works as it should.
      // I moved everything in as if it were .done.
      .fail(function(){
        $.ajax("http://localhost:5000/posts")
        .done(function(posts){
          newData.push(posts[posts.length - 1]);
          self.setState(function(state){
            return { data: newData };
          })
        })
        .fail(function(){
          self.setState(function(state){
            return { error: true };
          })
        });
      });
    }
  
    handleTitleTextboxChange(event){
      this.setState(
        function(state){
          return { titleTextboxValue: event.target.value };
        }
      )
    }

    handleUrlTextboxChange(event){
      this.setState(
        function(state){
          return { urlTextboxValue: event.target.value };
        }
      )
    }

    handleUpvote(id){
        //Part 3:
        //- Modify the local copy of the data
        //- Upvote the post on the server via API call
        //- if an error occurs set error to true in the state
        function compare(a, b) {
          if (a.points < b.points) return 1;
          if (b.points < a.points) return -1;
          return 0;
        }

        let newData = this.state.data;
        newData.forEach(function(post){
          if (post.id === id) post.points += 1;
        });
        newData.sort(compare);
        this.setState(function(state){
          return { data: newData };
        })

        let self = this;
        $.ajax({
          method: "PATCH",
          url: `http://localhost:5000/posts/${id}/upvote`,
        })
        .fail(function(){
          self.setState(function(state){
            return { error: true };
          })
        });
    }

    handleDownvote(id){
        //Part 4:
        //- Modify the local copy of the data
        //- Downvote the post on the server via API call
        //- if an error occurs set error to true in the state
        function compare(a, b) {
          if (a.points < b.points) return 1;
          if (b.points < a.points) return -1;
          return 0;
        }

        let newData = this.state.data;
        newData.forEach(function(post){
          if (post.id === id && post.points > 0) post.points -= 1;
        });
        newData.sort(compare);
        this.setState(function(state){
          return { data: newData };
        })

        let self = this;
        $.ajax({
          method: "PATCH",
          url: `http://localhost:5000/posts/${id}/downvote`,
        })
        .fail(function(){
          self.setState(function(state){
            return { error: true };
          })
        });
    }
  
    render() {
      let error = this.state.error;
      let isLoaded = this.state.isLoaded;

      if(error){
        return <div>Sorry, an error occurred.</div>
      }else if(!isLoaded){
        return <div>Loading...</div>
      }else{
        let handleUpvote = this.handleUpvote;
        let handleDownvote = this.handleDownvote;
        let todoList = this.state.data.map(function (post) {
          return <Post key={post.id} id={post.id} title={post.title} url={post.url} points={post.points} handleUpvote={ handleUpvote } handleDownvote={ handleDownvote }></Post>
        });
    
        return (
          <div>
            <h3>Tech News</h3>
            { todoList}
            <div>
              New Submission<br/>
              Title: <input type="text" value={ this.state.titleTextboxValue } onChange={ this.handleTitleTextboxChange }></input><br/>
              URL: <input type="text" value={ this.state.urlTextboxValue } onChange={ this.handleUrlTextboxChange }></input><br/>

              <button onClick={this.handleAddButtonPress}>Submit</button>
            </div>
          </div>
        );
      }
    }
  }

export default PostList;