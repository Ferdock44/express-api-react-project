import React from 'react';

class Post extends React.Component {
  constructor(props) {
    //boilerplate
    super(props);
    //hack to know about this
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }

  handleUpvote() {
    this.props.handleUpvote(this.props.id);
  }

  handleDownvote(){
    this.props.handleDownvote(this.props.id);
  }

  render() {
    let url;
    let domain;
    try {
      url = new URL(this.props.url);
      domain = url.hostname.replace('www.','');
    }catch{
      domain = this.props.url;  
    }
    //return JSX element
    return (
      <li>
        <button onClick={ this.handleUpvote }>Upvote</button>
        <button onClick={ this.handleDownvote }>Downvote</button>
        { this.props.points } points <a href={ this.props.url }>{ this.props.title }</a> { domain }
      </li>
    )
  }
}

export default Post;