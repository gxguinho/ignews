import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';

export function Header() {

  return(
    <header className={styles.headerContainer}> 
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="logo" />
        <nav>
          <ActiveLink id="homeLink" href="/" activeClassName={styles.active}>
            <a id="homeLink" >Home</a>
          </ActiveLink>
          <ActiveLink id="postsLink" href="/posts" activeClassName={styles.active}>
            <a id="postsLink" >Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}