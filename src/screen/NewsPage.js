import React, { useEffect, useState } from 'react'
import { SimpleGrid, Heading, Text, Center } from '@chakra-ui/react'
import Paginator from '../components/Paginator'
import NewsCard from '../components/News/NewsCard'
import { Link } from 'react-router-dom'
import { sendRequest } from '../utils/sendRequest'
import Spinner from '../utils/Spinner'

const NewsPage = () => {
  const [fetchAllNews, setFetchAllNews] = useState([])
  const [items, setItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const limit = 8
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getNews = async () => {
      const res = await sendRequest('get', `/news`)
      const total = res.count
      setPageCount(Math.ceil(total / limit))
      setFetchAllNews(res.rows)
      setItems(res.rows.slice(0, limit))
      setIsLoading(false)
    }
    getNews()
  }, [pageCount])

  const renderCards = () => {
    return items.map(item => {
      return (
        <Link to={`/novedades/${item.id}`} key={item.id}>
          <NewsCard title={item.name} image={item.image} />
        </Link>
      )
    })
  }

  const handlePageClick = data => {
    let currentPage = data.selected * limit
    setItems(fetchAllNews.slice(currentPage, currentPage + limit))
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Center h='25vh' marginBottom='2vh'>
            <Heading size='lg' fontSize='3rem'>
              <Text as={'span'} background={'#DB5752'}>
                Nov
              </Text>
              <Text as={'span'} background={'#FAFA88'}>
                eda
              </Text>
              <Text as={'span'} background={'#9AC9FB'}>
                des
              </Text>
            </Heading>
          </Center>
          <SimpleGrid columns={{ sm: 1, md: 2 }} p={8}>
            {renderCards()}
          </SimpleGrid>
          <Paginator onPageChange={handlePageClick} pageCount={pageCount} />
        </>
      )}
    </>
  )
}

export default NewsPage
