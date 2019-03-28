import React from 'react'
import HeaderContainer from './HeaderContainer'
import Footer from './Footer'

class MainLayout extends React.Component {
  render() {
    return (pug`
      .container-fluid
        HeaderContainer/
        = this.props.children
        Footer/
    `)
  }
}

export default MainLayout;
