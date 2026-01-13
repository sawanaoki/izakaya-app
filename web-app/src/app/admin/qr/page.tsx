'use client'

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export default function QPPage() {
    const tables = Array.from({ length: 12 }, (_, i) => i + 1)
    // In a real app, you'd get the base URL dynamically or from env
    // For local dev, we assume localhost:3000
    // Note: For actual mobile testing, this needs to be the LAN IP
    // I will add a script to show the LAN IP or just default to localhost for now
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:3000'

    const print = () => {
        window.print()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between no-print">
                <h1 className="text-3xl font-bold tracking-tight">QRコード発行</h1>
                <Button onClick={print}>
                    <Printer className="mr-2 h-4 w-4" />
                    印刷する
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-3 print:gap-4">
                {tables.map((tableId) => (
                    <Card key={tableId} className="flex flex-col items-center text-center print:shadow-none print:border-2">
                        <CardHeader className="pb-2">
                            <CardTitle>Table {tableId}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white p-2 rounded">
                                <QRCodeSVG
                                    value={`${baseUrl}/order/${tableId}`}
                                    size={150}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 break-all no-print">
                                {`${baseUrl}/order/${tableId}`}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <style jsx global>{`
        @media print {
          .no-print {
            display: none;
          }
          body {
            background: white;
          }
          .container {
            max-width: none;
            padding: 0;
          }
        }
      `}</style>
        </div>
    )
}
