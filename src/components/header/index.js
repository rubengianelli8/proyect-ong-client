import React, { useState, useEffect } from 'react'
import {
  Flex,
  Button,
  IconButton,
  Image,
  Spacer,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  useColorMode,
  Stack,
} from '@chakra-ui/react'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { HamburgerIcon, CloseIcon, ChevronDownIcon, SunIcon, MoonIcon } from '@chakra-ui/icons'
import { sendRequest } from '../../utils/sendRequest'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/user/userSlice'

const Header = ({
  webLinks = [{ name: 'Nosotros', path: '/nosotros' }],
  userLinks = [{ name: 'registro', path: '/registro' }],
}) => {
  const dispatch = useDispatch()
  const activeTextColor = 'tertiary'
  //states
  const [display, changeDisplay] = useState('none')
  const [image, setImage] = useState({})
  const history = useHistory()
  const getImage = () =>
    sendRequest('GET', '/organizations/1').then(res => {
      document.title = res.name
      const { image, alt } = res
      const favicon = document.getElementById('favicon')
      favicon.href = res.image

      setImage({ image, alt })
    })
  const userData = useSelector(state => state.user.userData)
  const isAuth = useSelector(state => state.user.authenticated)
  const profileImage = useSelector(state => state.user.userData.image)
  const { colorMode, toggleColorMode } = useColorMode()

  let itemsNav = webLinks.map((link, index) => (
    <ActiveLink
      key={index}
      activeOnlyWhenExact={true}
      to={link.path}
      label={link.name}
      activeTextColor={activeTextColor}
    />
  ))
  let userNav = userLinks.map((link, index) => (
    <ActiveLink
      key={index}
      activeOnlyWhenExact={true}
      to={link.path}
      label={link.name}
      activeTextColor={activeTextColor}
    />
  ))
  useEffect(() => {
    getImage()
  }, [userData])

  const handleLogout = () => {
    dispatch(logout())
    history.push('/')
  }

  return (
    <Stack>
      <Flex>
        <Flex display={['none', 'none', 'flex', 'flex']}>
          <Link to='/'>
            <Image
              src={image.image}
              alt={image.alt}
              maxW='5rem'
              mt={1}
              ml={1}
              mr={3}
              borderRadius={'5px'}
              maxh='30px'
              fallbackSrc='https://via.placeholder.com/150'
            />
          </Link>
          {itemsNav}
        </Flex>
        <Spacer />
        {!isAuth ? (
          <Flex ml='auto' mr={5}>
            <Flex display={['none', 'none', 'flex', 'flex']}>  
                {colorMode === 'light' ? 
                  <Button 
                  onClick={toggleColorMode}
                  mt={3}
                  mr={2}
                  variant = "outline"
                  color="tertiary"
                  >
                    <SunIcon />
                  </Button> 
                  : 
                  <Button 
                  onClick={toggleColorMode}
                  mt={3}
                  mr={2}
                  variant = "outline"
                  color={"secondary"}
                  >
                    <MoonIcon />
                  </Button>}
              {userNav}
              </Flex>
          </Flex>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <Avatar size={'sm'} src={profileImage} />
              <ChevronDownIcon />
            </MenuButton>
            <MenuList alignItems={'center'} justify="center">
              <br />
              <Center>
                <Avatar size={'2xl'} src={profileImage} />
              </Center>
              <br />
              <Center>
                <p>
                  {userData.firstName} {userData.lastName}
                </p>
              </Center>
              <br />
              <MenuDivider />
              {userData.isAdmin && (
                <Link to='/backoffice'>
                  <MenuItem>Administrar</MenuItem>
                </Link>
              )}
              <Link to='/perfil'>
                <MenuItem>Cuenta</MenuItem>
              </Link>
              {colorMode === 'light' ? 
                <MenuItem onClick={toggleColorMode} color={'tertiary'}>
                  <SunIcon />
                </MenuItem> 
                : 
                <MenuItem onClick={toggleColorMode} color={'secondary'}>
                  <MoonIcon />
                </MenuItem> 
                }
              <MenuItem color='tertiary' onClick={handleLogout}>
                Desconectarse
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        <Flex m={2} p={2}>
          <IconButton
            aria-label='Open Menu'
            size='lg'
            mr={2}
            my={3}
            icon={<HamburgerIcon />}
            display={['flex', 'flex', 'none', 'none']}
            onClick={() => changeDisplay('flex')}
          />
        </Flex>
        <Flex
          w='100vw'
          bgColor={colorMode === "light" ? "background" : "darkGray"}
          zIndex={20}
          h='100vh'
          pos='fixed'
          top='0'
          left='0'
          overflowY='auto'
          flexDir='column'
          display={display}
        >
          <Flex justify='flex-end'>
            <IconButton
              aria-label='Close Menu'
              mt={3}
              mr={3}
              size='md'
              icon={<CloseIcon />}
              onClick={() => changeDisplay('none')}
            />
          </Flex>
          <Flex 
          flexDir='column' 
          align='center' 
          onClick={() => changeDisplay('none')}
          >
            <ActiveLink
              activeOnlyWhenExact={true}
              to='/'
              label="Home"
              activeTextColor={activeTextColor}
            />
            {itemsNav}
            <hr />{!isAuth ? userNav : null}
          </Flex>
        </Flex>
      </Flex>
    </Stack>
  )
}
function ActiveLink ({ activeOnlyWhenExact, to, label, activeTextColor }) {
  let activeMatch = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact,
  })
  if (activeMatch) {
    return (
      <Link to={to}>
        <Button variant='ghost' my={3} w='100%' color={activeTextColor}>
          {label}
        </Button>
      </Link>
    )
  } else {
    return (
      <div>
        <Link to={to}>
          <Button variant='ghost' my={3} w='100%'>
            {label}
          </Button>
        </Link>
      </div>
    )
  }
}

export default Header
