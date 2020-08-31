import React from 'react'

const Post = ({ post }) => {
	return (
		<div className="post">
			<div className="post-author-details">
				<img
					className="post-profile-pic"
					src="https://images.unsplash.com/photo-1598405151786-c7a7824b81cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1402&q=80"
				/>
				<h2>{post.author}</h2>
			</div>
			<p>{post.body}</p>
			<div className="post-likes-comments">
				<div className="post-like">
					<i className="fa fa-heart"></i> Like{' '}
				</div>
				<div className="post-comments">
					<i className="fa fa-comments"></i> Comments{' '}
				</div>
			</div>
		</div>
	)
}

export default Post
