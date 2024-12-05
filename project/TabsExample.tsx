import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './src/components/ui/Tabs'

export const TabsExample: React.FC = () => {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="updates">Updates</TabsTrigger>
        <TabsTrigger value="backers">Backers</TabsTrigger>
      </TabsList>
      <TabsContent value="about">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">About this campaign</h3>
          <p className="text-gray-600">
            This is where you would put detailed information about your campaign.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="updates">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Campaign Updates</h3>
          <p className="text-gray-600">
            Here you can list recent updates and news about your campaign.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="backers">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Campaign Backers</h3>
          <p className="text-gray-600">
            This section could show a list of backers or statistics about campaign support.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

