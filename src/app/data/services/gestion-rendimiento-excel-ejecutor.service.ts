import { Injectable } from '@angular/core';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export const imgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAScAAAA+CAIAAADmlkrxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAACgbSURBVHhe7V0HeBvHlYasLstykds5cmyf5TjujkvcE5+V4jiJE+dc4lwcp9jnOLZjp+dc0i/FIjrALkqkKEqieu+9Uc0SibKL3kECJCoBEIWk75/dJbQoBMGmY77gfe/jBwKzs7Mz759X5s2s4OMSlahE55dKqCtRic43lVBXohKdbxot6tq7k6t1gRV0kLAubA0luB/Gnw7Yu3HHFXRgBRVcSQVtwfN36xKVaDQ0KtQtVvnvX+EQyAwCpY1wuf2OBnPZCW802ceVGB863R57YZPjQolGUGEXKK0ChU0gt97VaKtu9aX6+rlCJSrRRKURog6yvajNNxl4U1gFZSrBwjaO5SaB1PDHI57ecRP+I87INUpKUO4QiKhz9yW3Nk8S02/udsXH794lKtFY0AhRp/PHr6/RC6R6wcLWDNEHi3WTy9qc3Umu6JhSsrf/nnoDACZYyIM6x60Eh2JdMx3s7y8Br0QTl0aIumOuqEBmztByaRZqJi1sW6sLckXHlPbauqeL1dlajs9i3e11uu5xNnFLVKLR0AhRd7IjBvnOj7oyNfi1HQ6u6JjS6zucbP3ZN02zmJ4pVvl6erkLSlSiiUcjRN3/HOyAfA+COhV+eqTJyBUdU6o665sihDrVZt80zWL6crk2EC/puhJNXBoe6lJ9/d2J3pV0aJZIBUsyW+LTLNTMlqoXtfkjyb7EmMY22iPJi2VqgQT+ZM5NwQC81Pj2HleqBLoSTWAaHur0/sSzG6xE6Ek8I0fo+QxNKDM90mQ64oxyF48R/eGIRyA1CCS6PIEcpe3GGtpSWrgr0cSm4aEOakvV2fPObtft9SaBzJjfvxKqBXILUPeNdZYd1u6+sQ4n9vT2/emo54Zag0DEszPL2vDv4832Nm+MK1eiEk1UGqFf5+5O/qWl80ollSH6YBF1yyK97CPfTkt4/NarO6O9/7GCLAyeu6/EcH+DyRkal+WKEpVobGkkqIOr1kwF71isnybWZAdUhOoLZbT4hJcrOtbkDCfEp7quraSniqFmebcuU89R6p9ebz9oj3BFS1SiiUrDRt1RZ/T5jXbitsGzyhvDFGrw68/3uMLxsQzfQ3Ou0AbvaICK0zO3zjFuYdlKjZco6A9bvKVF8hJNZBoG6qDi/veY98oqE3HbIOJZQs9nAE9ufXmLM9k7NsHEPbbogpVmwUI140zmg3qaSRTH+PxGh94f5y4uUYkmGBWLus3G8OdXWpjg4SBR+ywmwLM8tdbu7h5VRFHdGfvZvvaZcj1JhSHLdDlxy1zGrRXW+bX6OpU/1VdaQyjRhKOhUefqTr6123UBLDpArkBSSC6jsMLy2RV29YjiiiRgc8xzRTlF9FuBFLD8rCKzg1DzwtZ2R7gUYinRxKJCqIOiWKwO3rlET3bxFEgHKcStuPb6Knq7OcxVWgTFUn2VZ/23L2GynMm6XFadRTNgX+68rU6/WhcseXolmjg0KOpoX/y5za4LJMRNOhcthBzj3wJZKWmG48cpqFaBzDRHSq2hA1zVgxOgsYoOPtRonIRrs1w4OGxFKluU4V8oM04VqV7Z7iytnpdoglAe1EWSfX9v8V5XY4B9yAEMfweE/mtrrFcoNEMC7zKZ5upyLbmELSnRTRZTC497uHvko3327hc2Won/prByAVKwmCKfFdabaukHGxnAw3TMWiTM5JlimJc6kpydbiQwXOm+t15fAt4/BTnDqb+2eD842vnB4Q6OT4Q2m4ZhLv3/kj/e+zu0+YiXa/wRzwdHu9boQ9zPuag73dHzAISbjZp8yOxYk1sguJdX6F/b6Tzqimo649dV0QLoQJ6gZ7OYvrGaPtUee2OXazIAwGotMTVJbvzlgfbczEy4cP+9wzWF7Em3zpKoL5NrLpKqCc4l+rkKLdTUaU/CHUl1J/rWG0MPLjNOF2lIC7NuyrJQe3e9vokKPLBUfwH0rcxEsCczfbbReNgZMQUStD9Rdbar7ETnMXfMG01xLSjRRKKjzhgRmOoOQYWD44bYD7Y7uZ8nPOkDcaI5qtq5xle6BDWdz6y3cj/zUaf2xt7Z10HEHd4UJBVKpsIxW6ZZsNKkPNPVGeMW3wCPSUTpFQ7fUxdJVIccZMG6QRu8vd5IpB8ABivMz22wemOcuJuDifcOdVympIGxz60wVbX6AIyeVJ81lHj/cMc7e50dkdTJ9ugea3hRm79BEzhgjzjDSfx7cy3J88y+L1hMX6XUAteopKbVd1+jCRr7i82maLL3iDPy8HLzLDnjKJapp0uoayqoPx31+AYaM2IKxvvOeqLqzp7Rs6qzB89+ns+hCPT07rdHtpnDMO8rz/rKTngXHvdi0FfrQltN4R3m8DFXtCd1/pp0wh3DzJth0ZQ73trj5n6e8GQKJiaXMRYi23iicnTf22rnfuaj7qXNNsEiPxFlaDmJ/roq6tcHvdstGWrdEkrcXAvdlU/c+YzbSHTf3sTdxhFOvnuwY6aEMTgrHI82GfDNGU8MwID3+L1tzoeWW5dqAvFU33pDCHr5vcOe9w97WGvwwxbPleXQt2ZyNgT+ivULmq2wRa3BxP3L8GVOEraYvlSu8Q/srwvEe6HZ2iPJFldktlRLtC7GEt0B30+oJeq03PHOblc0OSqRWqsPXlVjvraSGj1/olr/4iZb56gngiJplzX8mwPtTzRbBB+SrDpi3mNw0UuEmQ6Xosd0s8Sqr621/uqgt0HtH+9DcUD/Qqg73RG7qc44t9ry+ArzGl3IGMizyvzHIx0kvlJMSENhgR/VywsdHrB1P7zMfHWl/oC9u/wj3zWLrHfXG8rP+GBe+mIkuG8PJeair5eEiEaucM2r0H59LXMoCwlj8sI5StvV5dTJ9th+e/dFCh2Jr/LbI6YxYKHM/XWA9611jF+aLpZmkXaGlB5lHlm92i+oYjYcjp7llseajNDwXNXjRtutkSdXmy+BlVFuZ6wbNgSVY8LgSzAAgDIVrsllqjvrjT/Z7YKRMn7HZPwLoQ60mg7o/IOaNxDlx5cbicGa7osCLNLOUeiqzvq4ixmCYanpjNlDyU9WUoIaL6N5qCsUGii3A45Isq9/OR28bQkzywJL6HRIYV6EVzh/xFj5/3PAfctSBymJKZn9SUxdIlPDCmXvyJI9nJwmgujkXfRTQdCXaYeOrxagRm2ANDi75hGxWAeT3jOeDifG99f73ZPljPeOHs5qADqERRrLWTiEgcAcSPXSFvuY7yZJ078W6goTjMCZSiY4ke6LQtwqKHf+14CRySdrKCn/qOuaSmaTHglIkoDNNKHquU0OeGLGQGKJ2l/b6oOhNVmoyp96prA+tcaSYkbdFkw0aQOPNMEWYlSZUDNdpOLHi0AwR6cLmUgmvxKOVVDLK+lBT3lZrw9tMAxxBkw+1LWSjmJs9eGxwvboeOq6RG/fq9vsjN2YGQcmkkHCV0z4l6d78S9hPfnMzoBCzQVlbev043IuDksl1HEU7+3/wVY7CcgUk5PFssz0cKNhsMPCDL74W3s75sLCAfYwomgi0W/Ug03mfxz3QvFVt3bNkqizhYMwiawCWncu0cO1+/pam94X9/eknlxjJVVBMspUP9+bMULBeO9NNVR+d1SovVRBUV09KIZnhLmr7erZZAy/vcd1X4Ph7gbjLCl1ebnucMG9uXlQJ1RfJictvHOJYVh8S53h1e1OX894oa5J6yddmtGrTKRaarxMSd2xWP/NddZf7HN/cKjjvYMdb+x2fmu99ZFlxhtqdHMVuIoijynVTxW2jWvGTwl1HMHtniKlBGVFKjqGhcRlgobkqshHZz2x722xQ+7JYbJoJRhmp5iaIWr7ZJV2hhhGTo6uE1HThG1zpGq4GcTcLXdcVaE77o4ddUYuV1LsDP2l5uxTW1pc0asrdASWWSaTmP5ck7EB2rXN9+wG27wKCrboJHQT0cBm4vNUtc+tsuDxuYryUR7UKayv7nDAlhsB945bABOK7s4lOuY8RV5TxfR0Kf3WbtdHnhjuzhXlEb7rSfWrOnv+cMTz1fXOqWIChnE6eZGlEuoIQQn89oCbLJqne6FILne+e3DozjroiLy41UXsSUAOngNaib+k0/M499PE2ld3OA85Is+uh6Azjr7S/p/ryGLIj7c78BlS9cgyPVszn060R59aayOIAqcr/LB10odELRPYw0YF2EhsE6IJ8NPXVtHvH+lscQ0Ra8mLutd3ubifJwy1uKNzFbB7eUl2Qu0sGd2oznC/C9MWU1h6ujOcGMdI5j876tyR1BigDr7WxTItEcd0LxTJUuOjTaZiMkIwDQN7DzWaJmMqhb/OB0aayzTTROoPW7gEF1d36ownjrbpA0kYmbjLazucBD9S4/31eVAHHVJ51j9bknPOErkXezvYWloAZrpEM7+GbqKCRb62IS/qXts59qu6MJX1gcRmU/jptea763WfqdfdtUR352I9+bxE/9kGw8/2uvbZI+iQvAkAklNdJKp0bhyJSn9ihYH7eXQERWkKxNG8nZbuN3e5HlpqvHux4W7SPI7R1LvrDZ9vMlae9aGFBXzX4lHniab0wZTen+A4kDD440UuLSb6+g1EeHjXBhLoYe7nQSia7EPJQ87oT3Y5H2wkD4hR+Ey9/h5wgw4mg7qzB5I8WtTBwKhp8xN/OlfzFMMKa1ZsowABe4vafI8tN01Co/MCT6i9aZFxJRWIpfrNweRilV9+xi8+1fnSZvsciXoS+5xS4211Or6t1JPqW0kFv9RsnSLWEl3HrzDNGONyxwyx5vkN1hVUID6cnYHnAXWdsVTN2a7HV5onwSKA1Q19Bc3MMRONZFkML0CFfrhrieHPx7zbzGF+IhAEhUAuHaBCPUL1H48WStMrho44owtPB765zoIZjWkehIxZp8nLECShZpJIe8si/d9avDpfngWq4lH35h7XpHLHpIVtHAs1s8WqY0PZJiypu+IzxWq0ZOBa7QyRqrrNz/2cQ65wYonK//Q61lxicqeyHg0splEV/N5zLQePAHUQwGsrmbQSfkXFs8L6l2OeYfkqGm/s5kVM3CyrKpZJPI36zmY7tNwRV+QzDUZBpRujwkzhjD9Wbp9fTUUGFr5rW31fWGUTiJg07lwvkeUy9dUKzQfHfLss3exVw6LxRh2U28NNJlaNkxmUPMUgcwcGGKBCGchEpetiqTrEm7xf2mIncD037xD7/DubbdzPI6Vn1lkFdQFmHYjJQOCW/nitymKCdsbQlVs+tcRcfqaLq2iAikcdzHgy+uSmDItpIAcePvdzQYKnOlXEzF/ctbopQlVla35ju5kO3dPkIEMAJuUHeUbS/0xtWV8OF3UrqRAZnqyKimcRdWM1ZQ4U63xvMoQeaDRdKMOcnYMQfMOOBAAmM/6bklpFB8Px3qpW/1XlzPtGlLbZMu1Tq60fdcR8Pb1rDN2PNZkuQGGSxj0I3sBC9VShalh7kbJoXFG32xqeV8VstsrqEIwlphjMrzDICSCZxTd+GTF9uUIT4jlgvzvccQErFukyIuoKJRfCHTH97ZhniihT1NDbbNvQMDmTQoQPRL6zHoG8E+YCoabyTCdXF0PFo+6N3S4y7uliQs2Fw9F1M8jp/QN3EWqni1RVOajr6+//5f726XL0syUP0tDhaaUHfUBqyy0zfNQ91IjhHOSIlGKYEY79RSR/+GIpmByChUxmcx7IqS6RqckRtMzaOhlj8pC6X+93O8JJvT/+1Y3tX93gxo2Svf1r9MEvr7YKxMz7T4A60oascDmPmV+fW28dcbLF+KGuM9b7xRXG7MrRYEag0SGwJD+/wgTn+bbF+isUjPWoGAgLibS/2ufmhyUxs5AOhJTwa5Pob6w1HLCNRMmz9JEndm0l5kETqRkAU2CC0FwqU99Wp3+kyfjEStOCZtPnlptvqGImBRTIwp7UeH2dhQ+ViYM6QO6t3UywAKY7f82MkWqCQxF9pVILj+auJfr5NfQssUogZ9I80iXZwsNCHUx2DG32OA2PSUoXZtnCZ0BvMIQwQqS5g2FDqLlYqlmlC5ad6LycXTuCbKEv5JZbFhuXa4PxVB/8tzX68IJVzDm5JBzKmDFkRZi6UKK+roKaxnodWTWDUVJEvXegnWvNMCkf6mwQCO7nUdBSTWAyxDRjDiJe07fWw/kMwsC2hZLBeC8UuymQOO6ObjKG6lS+5zZYp0H5iOmz3gwl1p3ou6kmX2ac1HCJgv7xTpemaySHzUSTfZC5yQrz7Yv1HxzqqGvzw2A56oqag4muWKo70RtJ9gXiferOns3G8Dt73cRpJxKVFuJWQYXr+1sd6WzYiYO6PxzuYKaJTEMP87jUcF0V/fuj3vWG0In2GJ7UHk7Svvg+e/dyKoCeJMXSkjZc1D27wTYpC7gjYJH2ukp6sDd+BHpSvzvinSllMv3yQoJlSJ6IMvhJUNHdnaxt891cxyg9TO0y02SR9uk1lq+tsUyRkFRG8r3SDuDB8nyg0finY15I51K1/wKiRQe5hUQ3S6pdVcTW21zKgzqZ8atrrDss4Z2W7u2WcDG81RLNFXrxqU6SlZpRs/mne9sxv3Al8lG8t98SSr5/qCM3Bvv3Fubk7Ox111YCA5npigrdN9dZt5jClC8+rKPy0X6NP1lk0vZilf+y8szkGKFmjlR7eMAfmyCo0/nj0NjE0EvXD8ZEL9b9cr+7ffAYrC2cHHkMs83bcx0sh9ypcbgs0qIRmAm4enl0uiO2oJnAhtHgORfyGU0XUT/b6+6IpCCLx5wRSIXsdNcXV9uIWgPS8Bf1gJV23O6lbe4/H/Wgfu5OH38shAQXnkFkxvm1ejjZ3AVFUx7Ugck0wZi1xNgrgqs6XtmRbZS+e7BDoOQtkwq1MyXajYZiY8K5BEC+uMlGpqrchAciHExSmJieLVG9sNEmPeM/VFxkYrj05m43SXLg311mWj3w9rUJgrpXtztIEI5vaIioKRKq4ky275dFltAoVsnfwiORLa0j9ejSXEbisz/clvFurZ5U75+PeT9RxeSLDKZ/slhEXSnXeCKpn+x0XVpleWOXE8YVrKblWv+CZss0GY1eW9BsXk6H99jCQdyA59J4Y6knVpqH2IwLVlifXG3tGuaLuPKjDv2GASueK1z/neMK/mp/e0ZyglAzQ65fPrpcbejJ725xEsMbAEvXzGc0hsSrzFCzcxXar6+zwd82B8cyGUXxUddUKZMGmL6p3Fz+ERfMnCCou2cJndH5kFKh9rcH8jQji0aem4JevmdJEVvphmBmnw6gW90xS9zGxtNgHMHf+PIaB9nQNdjA52W4ZyJVoKcX1rOgIfLsBmv6oNtIotcSSsHyhCELZfX7I555VbqvrDanE5fgVExCDQUimSyjg2TGX+1zDesgz0FQB8ZsUjSXO3MDMOJTXYIKZ0adEsMXm82jfGdLqq9feKrr6loLaTaxZdAA3i34DO1HkvW0l5frXtnZPlZHYOyyhK9WZhpvMlPZwJHhEwF1jVr/JQomwTBduUgLg9NVRCrcyFFXddbHOADseOSMCr7nW0esZcJkUfHKqKeWtcHP/sY6K+y93x5o74wSkHijqS+vAg49jJYbCgZ8FmomC1W1rb6T7bGpSlt6kEBwQnaYwwtPdj5AIq5MY2SmKSL1uoEFepiapJ1Zt8M35Bkzv8Q0L9QuyvSqC1Me1HGHXzBB8yJ5cZA/MCzVtPpIzdwoDLCYnilSvbbDWXm2C75QcjhroXxCN769x/XpOj2Z0dEPaDARlHwIxGyFXlVY59cZGzX+0W/xOeGOfrKKyphzZSbhSW79YCKg7rubrNljKqK+v9UBE50tUIBGiDpPtPfJNTZBbSeRBvhLWU4XEQLVHIlqjlQ1R0b+3tdg+Ppa67sH27/UzJTniqmnyIxlx71ZObWJ3j6dL77NHH55m4McGDEM4BHH46nVFliV7+x2LtOeSyNAX7y5ywXBJQPJNI+UV1rZgYRc/nyfi/QvX3xlxocbjT/axix9QuDS34PFJBxsDBQ7r+dBndT4ldWWLabwMNhGtDRX4wDBif1ckyG7cjBZhLQKpGS14NEm41Nrbf+53rpWHwon+mLDPGrBFIhvNjFjoaCJrAB+6BDUn3VHlqXGaRJq4fFB32OBoemIJBs0gWfWW9Gqp9ZY8jImx+zU9gmGupe32MkSSLpmSI5Et6+43c8jRN1+R+SBZtdDy0yPNRm/sc4CQc/sIMMjTUZPJOmJEobLFE70snPAYUfk2ioovYEAjNL++k7HYFLQ19//wgYrmUTT8ys33Q7cKJelhk/V6qDZTIFE1maTSihnCCK/sNz83c02FO5O9M6VMco5/ZOYminRNlNBtOEvLZ2TpUyCVfpXsMx4W60OJitXe0HKgzql7ad7xib7GdMT2Q8FdcSfMljGoKD3MDPCCJSbp4lUV1bo7lisl5726fPFrgoQfGBPrHcVHXh2vfXeRhNZTC+3Z8h9msU6GBH16mzf8qQ7+ov9HddWaOcqSfCMuBXoE4xIXgaws2bbCYa6722xZYwpg7rj7qIM+xGiLtnbz49N/4IoCpLgR6oQUdOFKtjl3G859Jv9buY4I6ZP4Q9UmQ448rd1JR1kUiUGel+ouVyhId4X0a406Q72jnwmL0DW5D1w4ZgrSrao810FoeZipeFURyyS6LuIbNVLo46sMn95lZm78uOPl2kD/1ZtJBZyWhTwQWp4eUtRb1fPg7oxzQjbYgrd28gcYQJNTiamfGAA43v0G3pAZr6uWl/XNgwjmU89qf6lGv+ru9pnSzQk8SV3HpQa5lVoodPY8vHevr+1eGbJmMPgSAMGwiToQ7SWhNoH9simmYxF5uBOMNSRY4Qw76RrZlB31DWeqOMTjJzpIuJKDlxPf29LtvvBJ3s4eQNMds7ObBVUOBee8OaqO0cocX0VMwBsy+Tmu5YYjjojhxyRvx7z3lqnu1DO6B9+14PRAKnhxU3nDjlLE3TacxswufKln4RG9ti699q6yfp4WlhF1CyxqiWzB4+7I4+tGHBv2AVcETVFbvjrsQ6uxOA03qgDwYmvONP1QKPpUqWO7BuAroD2Y6U8d24CSw3TxNrfHxm68QUIjt9P9rRPQdedm7AYFmouEKr+xtiZxHrf6yLKVpK5rkWSE7SXyDSXKsgpTHcs1t0+wPgMCZmalbEw4XSdPVfXnT/USU51TsKkxVYh1Ewta9MOlbb33sF2slrNXiKm5tdQcB643wboZWhw4oOpSeBBbr5xkb6N59XAZD3j6Xlxk43EkbKkSml9ovmcmuITnD2mpwbKS/TweZzdyR/vcApEbNIw2wXUK5nLGCy5u1M/2u6YgrmZWJsAXitqmCWjh1w6Pw+oYyma7PP19G42hp9Za1nQbL673nAppBOtVcIazAQGWKKfIdbsHFE+N5/q1f4LofSypj+5+aFlZOtwdSsTdSOePy9hSma6dbEBfj6mbDQ4GO/rTmYw/NhPwDDhA/WfwcI80V7UGzvGAHX31jPnKLPXy0zvHuoYMmsBDv21FQMRKqa5sJG43xhqUPnnkOwERlDk5juWWulBXnz1wkZyrMM54OGzwgpL8lS+519FBy8DStPyp7S9f4hM9neTDdQDbhvpC7V6kKVwuHn1Kt+11cy51wS9mBFMtzWY8y7xp+m8oS6LfLEUNLn0VCeE71I4rsRZypyhpMbPL8/eVj8CAn7ILip22mJZbn50uRGC8P2t9gxLjPxk+uY6S9aBUVl0kPj/44M6UVuLeywsTKLrsi3MrcWdPz1a1MFZIs/P2oES3c11RntxGz1JyBt3ZX02Mf38Rns6tqbq7Lm+mlnEw09S4011Jva82rz0l2MeUs/AeN9cq7umnLh8UKdcCR7BFSVvToazTgqr8AGd2N/ffz0/SC03/eO4p/DEcbo98uByJhiA9kMVK21fWW1Jn7GZS/9fqOMTLIXvbnORjuJjQ2acX0N3DZwgPGJSdcaZ7bADYgSWm7+4ymwNJcnLZ9J9CxZR19caIdDclYMQbP55w9R1Py0GdWWqyTIDZiLu54JUGHXvH2onL9tIBx3AIurZ9dZitsyOFnXfhqqRDKzayc2YVrkfhiJYEfc2MEtnpLnaacI2Nm8NNtL3t9pQFUGF1HBVObXbWqiP0INMuxlhEmoO2COheK/4VFdF5pl/aXphk41M+ahcqL1IqkXl6w3B2dKBIZToYfkUc+aHN5p6dqOdTA24EI8vM76xyxkdpMcnAupA4XjvQ8tYv3SgGVL9jTW0ueglkMEI3T6FL0ZgheULzaYjzgg8twx4KCwvbSFxY+7KQagw6o67YsRyzkRd3hMxSO4OZImVTzA+yC0Hi8tiK4w6oz/xqdrMyLZIO0eqshShdUaFOkc4eVsdm57Sit58rMlQzMJ8mlbQQa5HABiR9jcHSK+t0QXJViU0SKqfI9NuzbQ8c8kYiE+CtkF5BnXqziEMaxiZF0kZ719mfKzJCI+C4FDO4BAsN4lPDeOd6b871D4TLg1juf1wG9R8/oyVCYI60A+3MaeDpqWQRd2oE0q+jT7kV8uI0Ws7HTssYWILZKDR+sp2x5Dv6iyMutMdsauUmTuzlNbnN1hz90aTZG5WNtIlpfq/FveK7MKoAy1oZjYHpmsmT039IF9EIItGhbo/HvGQN34QcddOVebZ81uYuhN9z29yEHVRppkkVK3TBzF/kLglDBKp/mI5tXPw5QeWTnXETrVHBf84h7qzniFQ5+/pu7GaRv2CCuebzF6bLzQzLwnCxKG0wf4sYCjmpRXawOu72qEzC4xjPtTZ2LuPkmAypAP0Q5IjnCAJH3xhlRpgYaaz41fpgi9utJ31xgNFd0Iw3guHSiBmNomnqxVTM4RtJ9pj0HXZpqBEf89Ss20ohVAYdfZw8uFlxgzDVWq4q96QO320emI3kOHmaSShZpZEw896H4xs4SRZqR8cdcupANlszrcd0Ali3Ru73ZGCx847uke65wD269fXML4NLpNbnllnGUHi0TZzaFY52RCA+Q8NhZNN9ttL9JdX0Kt1QwQGYYv+dr+7xRUl6xBCTLRFoQ70+AoMmA42yQeHOszB5PVVWjJ+Iu1FFebFI13CKkx5UCczPbPe2uKOtbijzN9iGXKs7Yqnk7wqz/qurjb+8ah3iyl8qiM62MlcndHUdnP48ZVMkk1aI4GZI2TS9h7UNcZimoS6t0EPK32zKXTUGQFCcnPKYNTst0fqNYH7GkhuXQbkUL9Ev2AlCdK4u5OPLjeSBYz0r2CZ6ad7XIUPnjnqijAZYflRl+ztf32nkwloDfyKm4roX+1z9g1osUgi1cVsLHphMx6KtWUGCkt0gOJKKhiIDzq56H1x8alOAqr03osc1OFeT61mTjfmdym6QmZasMqy1RyGJcUVzaQz3p4LRoa6TYbQJUodGUUxfaVCs98+kgA0RvPlzbYbFpnZCfvDE55HmsxXV+gxi7AFClC92v+Zer2vp5dsMAds8AxCTeFYIkuKM11o9icqKbqrp/JsF3uhQGb+1loLV2KsKQ/qFqqmiVQXSzUXS9XM32J5tox+eq0l/QalPx/1kBcyQaokuiuUGuhtiOPbe918fmO369EmJtWDP+WD8Y2Y/g1vq+4TmI+g9tEb8LdhO4npiySqu5bon15nfXXHuWr/a7P9vgYDOXJHgTJZxwi0wo6YJVadcHPT3y/3u8jZxPwy+Cw1fG2dbZk2kNfSwywgOuGdLcu0IXmoAwlPdGaEScBCzaSFrd9ab0ELgeovb+j4O7NgeNbTczn0rTQzTR94FtGPrzCh8C/3ucuOexWnOz887mUf8JUdzk/VMD4buih9SQ7qQJSvZ14F7zx/lskDkj3TMJ3e3tv+i31u8clO5Uddvz/c8fa+DtRPkoFJhwz0CT4PibooeZFV8hf72rnHlugeajRAHePL4TJUbdkJ72fr9R8c7thoDHXGUtBd20whqCBbTuEshq6YJmzT+xPLqSD7kLAcdlm7s4rl8nF3FM/50DKjM5wkfg7ES0TBoFWc7oLpklV4JBxOwWbjxwvyoY4RekgVpi3yt2iWmT+/3MhOUs7u5OeWM69YIrUxziqepdxOxiWLoW340Ta2vNJ26yIqfUQfFBox25S8pDm2hRA+eAH8avEs+DI9VZ8rjzrtVyiotbzj1iH0N9elF1p4JRWWqULVXfXGBxsNT66yfKXZ/ORK86NNRsykdyzRk/zbrPozUXfMFZlHdoGZiN+YLoMGY9ZgG7k49NO9nA1f2+onB+1kqVy0AVoaM4KCXXxisufwL3lAO9Or/NkkP+pAe2zd/17DnFuDvuKvSaJCUj+zRCxk6kcD8C/qz57+ikDdGl1wioTijh9Dy8pUUJeYuacI20bAJAUBNyYtJp8vkmoukZNXEWQVy2WmueQcIS6JAbwQ3w99ISpHsy8oYy5kKsG1kxa2wXXOKjlCVhifWGnmZ4HmR93ImPd2kb22CBEOom3II2SXzM9MR0G8lLb7lxr5jpA/3kvOyIDmRJ3DqJARGpSHJEn0D6xywyXjahyg9fogOUWOlUt+tWQSYexPci17dh278zhzIzlbv9L+jxPnUAeSn+6cqrRwk04uK+0/3uVKG5zLNIF51XArctrAMqYkgBx3yfqeZbYBaKGYlg3s8ePTqfYYOaZApOEshUHrz9el+BI/yUwvbDp3Flse1K2gGBmSMXF/lqGv2e4bAZMeZ47Zw4esnwozK3D4gAu5ljBWAb9MXsbQpttMKhnOtcVwlfuzjSaoTa6/Pv54idpPXlGEe42elefeLuLqTv14p/MyOZtdCS+I6UNSjH0BCJvfyPzFN1ISo2I+GOZVUjBNcw+iPdke+9+jHbAeiWhi+k9XyNZzTi1n1omuE2k+s9RU/lEX60rl0hlP7M3drllixnblqkUjmQohc1y1ZAtVduUozNxxjly3MtPvgGP49xYvSQwEUNlHI+0EM+JU4by1Tsc/3eyMN/bW3g5yFD9+JW1gngu3w03RhjQzt+O1E8XIs89VaH+210UN7sJsMoae3eQiecJsA7ieyVc/94CYZbi+nSHWfsjbmJYHdRibl7Y6Xt7meHmrvcS5/J0tzr8d9/Lf8ArH+tOLjfctHQO+q8H4+i6nn+emGwMJtS/53iHPvfWGW+r0/15NX1OhvUyuuUQGVuPvXIXmmgrqxlrdLYvop9dYNppghBcKIQKN6q5ETZv/sWWmT9fSN1TTV5WThMkLJeqZYhUYHy6Va+ZV0p+qpe9YTL93qOOst6eYUKrOH1+sDty/lOwLgV+NOmF3wFBK8+SytlliUjkaPL+WurWOfmSZUXa6C+2BB59361qrJ/bVNdb5tTpcgqcGX6XUXl9N31Sje269VZ+T0oRvhCe7MLPgkiuUWtwO9hGvASo0aY5Mc6VSe10V/ela3X1LDe8e7DjV0WMqYn2lJ9Wn6YqXneyEnTy/hr5KSU7Byqy/bYZIhQeE8kfld9TpX9vhPOaO0b54jLedIA/qSjQCGqtXKBauB7/B67aEki3u6EEHyRTH3xPt5DSuWG4gsgjCJaEEkaRDzugWc3idIbROH9psDB1xRhxh4ruO7LlwjTWYQNuadcHqVl9NaxfhNt+iNt9GY/iwMwLHPj6ck4kT5PylxDF3tMUV1Xb1+Hv47yPNT7gEk8VGYwiWSDWvATDldtu627w9XbGh1vILUk+qX9PZs8kURv013DP66tr8a3TkfDRXN8Zj0M4roa5EJTrfVEJdiUp0vqmEuhKV6PzSxx//H+gIx7yy0V7FAAAAAElFTkSuQmCC"
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class GestionRendimientoExcelEjecutorService {
  fileName: string = "GDR_";

  constructor() { }

  exportExcelEjecutor(excelData: { data_trabajador: any, data_jefe: any, data_filas: any; headers: any }) {
    console.log("data service trabajador", excelData);
    //Title, Header & Data
    const header = excelData.headers;
    const data_trabajador = excelData.data_trabajador;
    const data_jefe = excelData.data_jefe;
    const data_filas = excelData.data_filas;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('FORMATO');

    //Add Image
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('A1:C2');
    worksheet.addImage(myLogoImage, 'A1:C2');
    let logo = worksheet.getCell('A1');
    logo.border = {
      bottom: { style: 'thin' }
    };

    worksheet.mergeCells('D1', 'Q2');
    let titleRow = worksheet.getCell('D1');
    titleRow.value = 'FORMATO PARA LA GESTIÓN DEL RENDIMIENTO';
    titleRow.font = {
      name: 'Calibri',
      size: 10,
      // underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);

    worksheet.mergeCells('L4', 'N4');
    let titleEvaluador = worksheet.getCell('L4');
    titleEvaluador.value = 'DNI EVALUADOR/A';
    titleEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('O4:Q4');
    let titleEvaluadorResult = worksheet.getCell('O4');
    titleEvaluadorResult.value = data_jefe.numeroDocumento;
    titleEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row 
    worksheet.addRow([]);

    worksheet.mergeCells('A6:C6');
    let titleEntidad = worksheet.getCell('A6');
    titleEntidad.value = 'NOMBRE DE LA ENTIDAD';
    titleEntidad.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleEntidad.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleEntidad.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEntidad.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('D6:K6');
    let titleEntidadResult = worksheet.getCell('D6');
    titleEntidadResult.value = 'SEGURO SOCIAL DE SALUD - ESSALUD';
    titleEntidadResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleEntidadResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEntidadResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('L6', 'N6');
    let titleFechaMeta = worksheet.getCell('L6');
    titleFechaMeta.value = 'FECHA DE DEFINICIÓN DE METAS';
    titleFechaMeta.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleFechaMeta.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleFechaMeta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFechaMeta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('O6:Q6');
    let titleFechaMetaResult = worksheet.getCell('O6');
    titleFechaMetaResult.value = '24/11/2023';
    titleFechaMetaResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleFechaMetaResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFechaMetaResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);

    worksheet.mergeCells('A8', 'I8');
    let titleServidorEvaluado = worksheet.getCell('A8');
    titleServidorEvaluado.value = 'SERVIDOR/A EVALUADO/A';
    titleServidorEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleServidorEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleServidorEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleServidorEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('J8:Q8');
    let titleServidorEvaluador = worksheet.getCell('J8');
    titleServidorEvaluador.value = 'SERVIDOR/A EVALUADOR/A';
    titleServidorEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleServidorEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleServidorEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleServidorEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    //EVALUADO ----------------------------------------------------------------
    worksheet.mergeCells('A9', 'D9');
    let titleApellidos = worksheet.getCell('A9');
    titleApellidos.value = 'APELLIDOS Y NOMBRES';
    titleApellidos.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleApellidos.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleApellidos.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidos.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E9:I9');
    let titleApellidosResult = worksheet.getCell('E9');
    titleApellidosResult.value = data_trabajador.nombre;
    titleApellidosResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleApellidosResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidosResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A10', 'D10');
    let titlePuesto = worksheet.getCell('A10');
    titlePuesto.value = 'PUESTO';
    titlePuesto.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePuesto.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePuesto.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuesto.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E10:I10');
    let titlePuestoResult = worksheet.getCell('E10');
    titlePuestoResult.value = data_trabajador.cargo;
    titlePuestoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titlePuestoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuestoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A11', 'D11');
    let titleSegmentoEvaluado = worksheet.getCell('A11');
    titleSegmentoEvaluado.value = 'SEGMENTO';
    titleSegmentoEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleSegmentoEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleSegmentoEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E11:I11');
    let titleSegmentoEvaluadoResult = worksheet.getCell('E11');
    titleSegmentoEvaluadoResult.value = data_trabajador.segmento;
    titleSegmentoEvaluadoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleSegmentoEvaluadoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluadoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A12', 'D12');
    let titleUnidadEvaluado = worksheet.getCell('A12');
    titleUnidadEvaluado.value = 'ÓRGANO O UNIDAD ORGÁNICA';
    titleUnidadEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleUnidadEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleUnidadEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E12:I12');
    let titleUnidadEvaluadoResult = worksheet.getCell('E12');
    titleUnidadEvaluadoResult.value = data_trabajador.codUnidad;
    titleUnidadEvaluadoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleUnidadEvaluadoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluadoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A13', 'D13');
    let titleFirmaEvaluado = worksheet.getCell('A13');
    titleFirmaEvaluado.value = 'FIRMA (a la definición de la meta)';
    titleFirmaEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleFirmaEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleFirmaEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('E13:I13');
    let titleFirmaEvaluadoResult = worksheet.getCell('E13');
    titleFirmaEvaluadoResult.value = '';
    titleFirmaEvaluadoResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleFirmaEvaluadoResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluadoResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //SERVIDOR/A EVALUADOR/A ----------------------------------------------------------------
    worksheet.mergeCells('J9', 'M9');
    let titleApellidosEvaluador = worksheet.getCell('J9');
    titleApellidosEvaluador.value = 'APELLIDOS Y NOMBRES';
    titleApellidosEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleApellidosEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleApellidosEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidosEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('N9:Q9');
    let titleApellidosEvaluadorResult = worksheet.getCell('N9');
    titleApellidosEvaluadorResult.value = data_jefe.nombre;
    titleApellidosEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleApellidosEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleApellidosEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('J10', 'M10');
    let titlePuestoEvaluador = worksheet.getCell('J10');
    titlePuestoEvaluador.value = 'PUESTO';
    titlePuestoEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePuestoEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePuestoEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuestoEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('N10:Q10');
    let titlePuestoEvaluadorResult = worksheet.getCell('N10');
    titlePuestoEvaluadorResult.value = data_jefe.cargo;
    titlePuestoEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titlePuestoEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuestoEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('J11', 'M11');
    let titleSegmentoEvaluador = worksheet.getCell('J11');
    titleSegmentoEvaluador.value = 'SEGMENTO';
    titleSegmentoEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleSegmentoEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleSegmentoEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('N11:Q11');
    let titleSegmentoEvaluadorResult = worksheet.getCell('N11');
    titleSegmentoEvaluadorResult.value = data_jefe.segmento;
    titleSegmentoEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleSegmentoEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSegmentoEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('J12', 'M12');
    let titleUnidadEvaluador = worksheet.getCell('J12');
    titleUnidadEvaluador.value = 'ÓRGANO O UNIDAD ORGÁNICA';
    titleUnidadEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleUnidadEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleUnidadEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('N12:Q12');
    let titleUnidadEvaluadorResult = worksheet.getCell('N12');
    titleUnidadEvaluadorResult.value = data_jefe.codUnidad;
    titleUnidadEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleUnidadEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleUnidadEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('J13', 'M13');
    let titleFirmaEvaluador = worksheet.getCell('J13');
    titleFirmaEvaluador.value = 'FIRMA (a la definición de la meta)';
    titleFirmaEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleFirmaEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleFirmaEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('N13:Q13');
    let titleFirmaEvaluadorResult = worksheet.getCell('N13');
    titleFirmaEvaluadorResult.value = '';
    titleFirmaEvaluadorResult.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
    };
    titleFirmaEvaluadorResult.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFirmaEvaluadorResult.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);

    //ETAPA DE PLANIFICACIÓN --------------------------------------------------------------
    worksheet.mergeCells('A15', 'L15');
    let titlePlanificacion = worksheet.getCell('A15');
    titlePlanificacion.value = 'ETAPA DE PLANIFICACIÓN';
    titlePlanificacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titlePlanificacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titlePlanificacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePlanificacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('M15', 'O15');
    let titleSeguimiento = worksheet.getCell('M15');
    titleSeguimiento.value = 'ETAPA DE SEGUIMIENTO';
    titleSeguimiento.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleSeguimiento.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleSeguimiento.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSeguimiento.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('P15', 'Q15');
    let titleEvaluacion = worksheet.getCell('P15');
    titleEvaluacion.value = 'ETAPA DE EVALUACIÓN';
    titleEvaluacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    titleEvaluacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    titleEvaluacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvaluacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A16', 'C17');
    let titlePrioridad = worksheet.getCell('A16');
    titlePrioridad.value = 'PRIORIDADES ANUALES DE GESTIÓN DEL ÓRGANO O UNIDAD ORGÁNICA';
    titlePrioridad.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePrioridad.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePrioridad.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePrioridad.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('D16', 'L16');
    let titleMeta = worksheet.getCell('D16');
    titleMeta.value = 'META';
    titleMeta.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleMeta.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleMeta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleMeta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('M16', 'O16');
    let titleSubSeguimiento = worksheet.getCell('M16');
    titleSubSeguimiento.value = 'SEGUIMIENTO Y RETROALIMENTACIÓN';
    titleSubSeguimiento.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleSubSeguimiento.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleSubSeguimiento.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleSubSeguimiento.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('D17', 'E17');
    let titleIndicador = worksheet.getCell('D17');
    titleIndicador.value = 'INDICADOR / PRODUCTO';
    titleIndicador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleIndicador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleIndicador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleIndicador.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    let titleValorMeta = worksheet.getCell('F17');
    titleValorMeta.value = 'VALOR META';
    titleValorMeta.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleValorMeta.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleValorMeta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleValorMeta.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    let titlePeso = worksheet.getCell('G17');
    titlePeso.value = 'PESO';
    titlePeso.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePeso.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePeso.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePeso.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('H17', 'I17');
    let titleEvidencia = worksheet.getCell('H17');
    titleEvidencia.value = 'EVIDENCIA';
    titleEvidencia.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleEvidencia.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleEvidencia.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleEvidencia.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('J17', 'K17');
    let titlePlazos = worksheet.getCell('J17');
    titlePlazos.value = 'PLAZOS';
    titlePlazos.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePlazos.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePlazos.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePlazos.alignment = { vertical: 'middle', horizontal: 'center' };

    let titleFormula = worksheet.getCell('L17');
    titleFormula.value = 'TIPO DE FÓRMULA*';
    titleFormula.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleFormula.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleFormula.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleFormula.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('M17', 'O17');
    let titleComentario = worksheet.getCell('M17');
    titleComentario.value = 'COMENTARIOS';
    titleComentario.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleComentario.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleComentario.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleComentario.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('P16', 'P17');
    let titleLogro = worksheet.getCell('P16');
    titleLogro.value = 'LOGRO FINAL POR META';
    titleLogro.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titleLogro.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titleLogro.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titleLogro.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('Q16', 'Q17');
    let titlePuntuacion = worksheet.getCell('Q16');
    titlePuntuacion.value = 'PUNTUACIÓN POR META';
    titlePuntuacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    titlePuntuacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    titlePuntuacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    titlePuntuacion.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    data_filas.forEach((d: any) => {
      let row = worksheet.addRow(Object.values(d));
      console.log("row", d);

      const currentRowIdx = worksheet.rowCount;
      const endColumnIdx = worksheet.columnCount;
      // merge by start row, start column, end row, end column 
      worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, 3); // actividad
      worksheet.mergeCells(currentRowIdx, 4, currentRowIdx, 5); // indicador
      worksheet.mergeCells(currentRowIdx, 6, currentRowIdx, 6); // valor meta
      worksheet.mergeCells(currentRowIdx, 7, currentRowIdx, 7); // porcentaje
      worksheet.mergeCells(currentRowIdx, 8, currentRowIdx, 9); // evidencia
      worksheet.mergeCells(currentRowIdx, 10, currentRowIdx, 11); // plazos
      worksheet.mergeCells(currentRowIdx, 13, currentRowIdx, 15); // comentarios

      worksheet.getRow(currentRowIdx).getCell('A').value = d.prioridad;
      worksheet.getRow(currentRowIdx).getCell('D').value = d.indicador;
      worksheet.getRow(currentRowIdx).getCell('F').value = d.valorMeta;
      worksheet.getRow(currentRowIdx).getCell('G').value = d.peso + '%';
      worksheet.getRow(currentRowIdx).getCell('H').value = d.nombreTarea;
      worksheet.getRow(currentRowIdx).getCell('J').value = d.plazo;
      worksheet.getRow(currentRowIdx).getCell('M').value = d.comentario;

      let a = row.getCell('A');
      a.font = { size: 8 };
      a.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn('A').width = 8;

      let b = row.getCell('D');
      b.font = { size: 8 };
      b.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn('D').width = 8;

      let c = row.getCell('F');
      c.font = { size: 8 };
      c.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn('F').width = 8;

      let e = row.getCell('G');
      e.font = { size: 8 };
      e.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn('G').width = 8;

      let f = row.getCell('H');
      f.font = { size: 8 };
      f.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn('H').width = 8;

      let g = row.getCell('J');
      g.font = { size: 8 };
      g.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn('J').width = 8;

      let m = row.getCell('M');
      m.font = { size: 8 };
      m.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn('M').width = 8;

    });

    //RESULTADOS FINALES--------------------------------------------------------------
    worksheet.mergeCells('A35', 'Q35');
    let resultados = worksheet.getCell('A35');
    resultados.value = 'RESULTADOS FINALES';
    resultados.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    resultados.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    resultados.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    resultados.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A36', 'C37');
    let puntuacionFinal = worksheet.getCell('A36');
    puntuacionFinal.value = 'PUNTUACIÓN FINAL';
    puntuacionFinal.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    puntuacionFinal.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    puntuacionFinal.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    puntuacionFinal.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('D36', 'E37');
    let calificacion = worksheet.getCell('D36');
    calificacion.value = 'CALIFICACIÓN';
    calificacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    calificacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    calificacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    calificacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('F36', 'O37');
    let feetback = worksheet.getCell('F36');
    feetback.value = 'RETROALIMENTACIÓN FINAL Y PLAN DE MEJORA';
    feetback.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    feetback.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    feetback.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    feetback.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('P36', 'Q37');
    let meet = worksheet.getCell('P36');
    meet.value = 'FECHA DE REUNIÓN DE RETROALIMENTACIÓN';
    meet.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    meet.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    meet.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    meet.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('A38', 'C39');
    let puntuacion = worksheet.getCell('A38');
    puntuacion.value = '30.00';
    puntuacion.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    puntuacion.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f2f2f2' },
      bgColor: { argb: 'ffffff' }
    };
    puntuacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    puntuacion.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('D38', 'E39');
    let calificacionFinal = worksheet.getCell('D38');
    calificacionFinal.value = 'Rendimiento Sujeto a Observación';
    calificacionFinal.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    calificacionFinal.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'f2f2f2' },
      bgColor: { argb: 'ffffff' }
    };
    calificacionFinal.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    calificacionFinal.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    worksheet.mergeCells('F38:G38');
    let capacitacion = worksheet.getCell('F38');
    capacitacion.value = 'Capacitaciones:';
    capacitacion.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    capacitacion.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    capacitacion.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('H38:O38');
    let capacitacionRespuesta = worksheet.getCell('H38');
    capacitacionRespuesta.value = '';
    capacitacionRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    capacitacionRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    capacitacionRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('P38:Q39');
    let meetRespuesta = worksheet.getCell('P38');
    meetRespuesta.value = '';
    meetRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    meetRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    meetRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('F39:G39');
    let recomendaciones = worksheet.getCell('F39');
    recomendaciones.value = 'Recomendaciones:';
    recomendaciones.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    recomendaciones.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    recomendaciones.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('H39:O39');
    let recomendacionRespuesta = worksheet.getCell('H27');
    recomendacionRespuesta.value = '';
    recomendacionRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    recomendacionRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    recomendacionRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    //FIRMAS DE LOS RESULTADOS FINALES --------------------------------------------------------------
    worksheet.mergeCells('A40', 'Q40');
    let firmaFinal = worksheet.getCell('A40');
    firmaFinal.value = 'FIRMAS DE LOS RESULTADOS FINALES';
    firmaFinal.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: 'ffffff' },
    };
    firmaFinal.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '009bcf' },
      bgColor: { argb: 'ffffff' }
    };
    firmaFinal.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaFinal.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A41', 'C42');
    let firmaEvaluado = worksheet.getCell('A41');
    firmaEvaluado.value = 'FIRMA EVALUADO/A';
    firmaEvaluado.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    firmaEvaluado.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    firmaEvaluado.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluado.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('D41:I42');
    let firmaEvaluadoRespuesta = worksheet.getCell('D41');
    firmaEvaluadoRespuesta.value = '';
    firmaEvaluadoRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    firmaEvaluadoRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluadoRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('J41', 'L42');
    let firmaEvaluador = worksheet.getCell('J41');
    firmaEvaluador.value = 'FIRMA EVALUADOR/A';
    firmaEvaluador.font = {
      name: 'Calibri',
      size: 8,
      bold: true,
      color: { argb: '000000' },
    };
    firmaEvaluador.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8d8d8' },
      bgColor: { argb: 'ffffff' }
    };
    firmaEvaluador.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluador.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('M41:Q42');
    let firmaEvaluadorRespuesta = worksheet.getCell('M41');
    firmaEvaluadorRespuesta.value = '';
    firmaEvaluadorRespuesta.font = {
      name: 'Calibri',
      size: 8,
      bold: false,
    };
    firmaEvaluadorRespuesta.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    firmaEvaluadorRespuesta.alignment = { vertical: 'middle', horizontal: 'center' };

    //Blank Row
    worksheet.addRow([]);
    worksheet.addRow([]);

    // //Footer Row
    // let footerRow = worksheet.addRow([
    //   'Fecha del Reporte '
    // ]);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'd9e0f0' },
    // };
    // footerRow.getCell(1).font = {
    //   name: 'Calibri',
    //   size: 8,
    // };
    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE, });
      fs.saveAs(blob, this.fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }
}