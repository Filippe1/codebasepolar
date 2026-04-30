// cv rank battle part

import { PolarEmbedCheckout } from '@polar-sh/checkout/embed'
import { useEffect } from 'react'

const PurchaseLink = () => {
  useEffect(() => {
    PolarEmbedCheckout.init()
  }, [])

  return (
    <><a href="https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_KkJUjqIMrvz91KCdQlDh5m1azyXntCVuqJQFi14Vmbg/redirect" 
         data-polar-checkout data-polar-checkout-theme="dark">
            Purchase</a>
            <script src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js" defer data-auto-init>
            </script></>
  )
}

export default PurchaseLink


