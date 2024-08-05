    let items = buckets.zip().map(|bucket| {
        let pb = public_bucket.bucket.to_owned();
        tokio::spawn(async move {
            let name = bucket.bucket.name.clone();
            let listed = pb
                .list(name.clone(), None)
                .await
                .expect("Failed to list objects");

            (name, listed)
        })
    });

    let items = future::join_all(items).await;
    let mut bucket_results: HashMap<String, Vec<String>> = HashMap::new();

    for item in items {
        if item.is_err() {
            continue;
        }
        let item = item.unwrap();
        item.1.into_iter().for_each(|sub_item| {
            let bucket_name = item.0.clone().to_string();
            let keys = sub_item.contents.into_iter().map(|object| object.key);
            // let mut current_items = bucket_results.get(&bucket_name);

            match bucket_results.get_mut(&bucket_name) {
                Some(current_items) => {
                    keys.for_each(|key| current_items.push(key));
                }
                None => {
                    let mut new_vec = Vec::new();
                    keys.for_each(|key| new_vec.push(key));
                    bucket_results.insert(bucket_name.clone(), new_vec);
                }
            };
        });
    }
