import React, { useEffect, useState } from 'react'
import { Center, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import Paginator from '../components/Paginator'
import ActivitiesCard from '../components/Activities/ActivitiesCard'
import { Link } from 'react-router-dom'
import { sendRequest } from '../utils/sendRequest'

const ActivitiesPage = () => {
  const [fetchAllActivities, setFetchAllActivities] = useState([])
  const [items, setItems] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const limit = 8

  useEffect(() => {
    const getActivities = async () => {
      const res = await sendRequest('get', `/activities`)
      const total = res.count
      setPageCount(Math.ceil(total / limit))
      setFetchAllActivities(res.rows)
      setItems(res.rows.slice(0, limit))
    }
    getActivities()
  }, [pageCount])

  const renderCards = () => {
    return items.map(item => {
      return (
        <Link to={`/actividades/${item.id}`} key={item.id}>
          <ActivitiesCard title={item.name} image={item.image} />
        </Link>
      )
    })
  }

  const handlePageClick = async data => {
    let currentPage = data.selected * limit
    setItems(fetchAllActivities.slice(currentPage, currentPage + limit))
  }

  return (
    <>
      <Center h='25vh' marginBottom='2vh'>
        <Heading size='lg' fontSize='3rem'>
          <Text as={'span'} background={'#DB5752'}>
            Acti
          </Text>
          <Text as={'span'} background={'#FAFA88'}>
            vida
          </Text>
          <Text as={'span'} background={'#9AC9FB'}>
            des
          </Text>
        </Heading>
      </Center>
      <SimpleGrid columns={{ sm: 1, md: 2 }}>{renderCards()}</SimpleGrid>
      <Paginator onPageChange={handlePageClick} pageCount={pageCount} />
    </>
  )
}

export default ActivitiesPage
