import { useState } from 'react'
import { Card, CardBody } from '@heroui/card';
import { Tab, Tabs } from '@heroui/tabs'
import { Login } from '@/features/user/login';
import { Register } from '@/features/user/register';

export const Auth = () => {

  const [selected, setSelected] = useState('login')

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className="flex flex-col">
        <Card className='max-w-full w-[340px] h-[450px]'>
          <CardBody className='overflow-hidden'>
            <Tabs
              fullWidth
              size='md'
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as string)}
            >
              <Tab key={'login'} title='Login'>
                <Login setSelected={setSelected} />
              </Tab>
              <Tab key={'register'} title='Register'>
                <Register setSelected={setSelected} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
