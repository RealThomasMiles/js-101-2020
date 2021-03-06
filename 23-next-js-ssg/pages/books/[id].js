import Head from 'next/head';

import { gql } from '@apollo/client';
import { gqlClient } from '../../src/modules/gql-client';

export default function BookPage({ book }) {
  console.log(book);

  return (
    <div>
      <Head>
        <title>Book: {book.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Book: {book.title}</h1>

      <section>
        <h2>Author</h2>
        <p>{book.author.firstName} {book.author.middleName} {book.author.lastName}</p>
      </section>

    </div>
  );
}

export async function getStaticPaths() {
  const { data } = await gqlClient.query({
    query: gql`
      query {
        books {
          id
        }
      }
    `,
  });

  const paths = data.books.map(book => ({
    params: {
      id: book.id,
    },
  }))

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps(context) {
  const { data } = await gqlClient.query({
    query: gql`
      query Book($id: String!){
        books(id: $id) {
          title
          author {
            firstName
            middleName
            lastName
          }
        }
      }
    `,
    variables: {
      id: context.params.id
    }
  });

  console.log(data);

  return {
    props: {
      book: data.books[0]
    }
  }
}
