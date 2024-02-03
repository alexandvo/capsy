import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.centeredContainer}>
          <Image
            src={"/time-capsule-icon.png"}
            className={styles.logo}
            width={100}
            height={100}
          />
          <div className={styles.loginContainer}>
            <h1>Log in</h1>
            <div className={styles.inputBox}>
              <h4>Email</h4>
              <input type="text" placeholder="Enter your email..."></input>
            </div>
            <div className={styles.inputBox}>
              <h4>Password</h4>
              <input type="text" placeholder="Enter your password..."></input>
            </div>
            <div className={styles.loginButt}>
              <div>Log in</div>
            </div>
            <p>Forgot your password?</p>
          </div>
        </div>
      </div>
      <div className={styles.signUpContainer}>
          <p>Don't have an account?</p>
          <Link href={"/signup"} style={{ color: "black" }}>
            <p className={styles.link}>Sign up</p>
          </Link>
      </div>
    </>
  );
}
