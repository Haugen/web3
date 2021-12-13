import Head from 'next/head'
import Link from 'next/link'

import { getSortedPostsData } from '../lib/posts'
import Layout, { siteTitle } from '../components/layout'

export const getStaticProps = async () => {
  const allPostsData = getSortedPostsData()

  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className='container mx-auto'>
        <h2 className='text-4xl'>Blog</h2>
        <ul>
          {allPostsData.map(({ id, date, title }) => {
            return (
              <li key={id}>
                <h3 className='text-2xl'>{title}</h3>
                <p><span>{id}</span> - <span>{date}</span></p>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  )
}
