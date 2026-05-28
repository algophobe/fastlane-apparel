```tsx
const handleProofSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault()

  if (!paymentMethod) return

  setSubmitting(true)

  try {
    const order: Order = {
      id: orderId,
      items,
      customer,
      paymentMethod,
      subtotal: sub,
      shipping,
      total,
      status: proofFile
        ? 'pending_verification'
        : 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const webhook =
      import.meta.env.VITE_DISCORD_WEBHOOK

    if (webhook) {
      await fetch(webhook, {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          embeds: [
            {
              title: '🛒 New Order',

              color: 0xffffff,

              fields: [
                {
                  name: 'Customer',

                  value: `${customer.firstName} ${customer.lastName}`,

                  inline: true,
                },

                {
                  name: 'Email',

                  value: customer.email,

                  inline: true,
                },

                {
                  name: 'Phone',

                  value:
                    customer.phone || 'N/A',

                  inline: true,
                },

                {
                  name: 'Address',

                  value: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}`,
                },

                {
                  name: 'Payment Method',

                  value: paymentMethod,

                  inline: true,
                },

                {
                  name: 'Total',

                  value: `$${total.toFixed(
                    2
                  )}`,

                  inline: true,
                },

                {
                  name: 'Order ID',

                  value: orderId,
                },
              ],

              footer: {
                text: 'Fastlane Apparel',
              },

              timestamp:
                new Date().toISOString(),
            },
          ],
        }),
      })
    }

    addOrder(order)

    clearCart()

    toast.success(
      'Order placed successfully'
    )

    navigate(`/order/${orderId}`)
  } catch (err) {
    console.error(err)

    toast.error(
      'Failed to place order'
    )
  } finally {
    setSubmitting(false)
  }
}
```
